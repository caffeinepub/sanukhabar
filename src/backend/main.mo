import Map "mo:core/Map";
import List "mo:core/List";
import Order "mo:core/Order";
import Blob "mo:core/Blob";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Int "mo:core/Int";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  public type ArticleId = Nat;
  public type CategoryId = Nat;

  public type Category = {
    id : CategoryId;
    name : Text;
  };

  public type ArticleState = {
    id : ArticleId;
    title : Text;
    content : Text;
    author : Text;
    category : CategoryId;
    publishedAt : Time.Time;
    imageUrl : ?Text;
  };

  module ArticleState {
    public func compareByDate(article1 : ArticleState, article2 : ArticleState) : Order.Order {
      Int.compare(article2.publishedAt, article1.publishedAt);
    };
  };

  public type ArticleInput = {
    title : Text;
    content : Text;
    author : Text;
    category : CategoryId;
    imageUrl : ?Text;
  };

  public type UserProfile = {
    name : Text;
  };

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let categories = Map.empty<CategoryId, Category>();
  let articles = Map.empty<ArticleId, ArticleState>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Category Management (Admin-only)
  public shared ({ caller }) func createCategory(name : Text) : async CategoryId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create categories");
    };
    let newId = categories.size();
    let newCategory : Category = {
      id = newId;
      name;
    };
    categories.add(newId, newCategory);
    newId;
  };

  public shared ({ caller }) func updateCategory(id : CategoryId, name : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update categories");
    };
    switch (categories.get(id)) {
      case (null) { Runtime.trap("Category not found") };
      case (?existing) {
        let updated : Category = {
          id = existing.id;
          name;
        };
        categories.add(id, updated);
      };
    };
  };

  public shared ({ caller }) func deleteCategory(id : CategoryId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete categories");
    };
    switch (categories.get(id)) {
      case (null) { Runtime.trap("Category not found") };
      case (?_) {
        categories.remove(id);
      };
    };
  };

  public query ({ caller }) func getCategories() : async [Category] {
    categories.values().toArray();
  };

  // Article Management
  public shared ({ caller }) func createArticle(input : ArticleInput) : async ArticleId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create articles");
    };
    let newId = articles.size();
    let newArticle : ArticleState = {
      id = newId;
      title = input.title;
      content = input.content;
      author = input.author;
      category = input.category;
      publishedAt = Time.now();
      imageUrl = input.imageUrl;
    };
    articles.add(newId, newArticle);
    newId;
  };

  public shared ({ caller }) func updateArticle(id : ArticleId, input : ArticleInput) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update articles");
    };
    switch (articles.get(id)) {
      case (null) { Runtime.trap("Article not found") };
      case (?existing) {
        let updated : ArticleState = {
          id = existing.id;
          title = input.title;
          content = input.content;
          author = input.author;
          category = input.category;
          publishedAt = existing.publishedAt;
          imageUrl = input.imageUrl;
        };
        articles.add(id, updated);
      };
    };
  };

  public shared ({ caller }) func deleteArticle(id : ArticleId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete articles");
    };
    switch (articles.get(id)) {
      case (null) { Runtime.trap("Article not found") };
      case (?_) {
        articles.remove(id);
      };
    };
  };

  public query ({ caller }) func getArticles() : async [ArticleState] {
    let articlesArray = articles.values().toArray();
    articlesArray.sort(ArticleState.compareByDate);
  };

  public query ({ caller }) func getArticlesByCategory(categoryId : CategoryId) : async [ArticleState] {
    let filtered = articles.values().toArray().filter(
      func(article) { article.category == categoryId }
    );
    filtered.sort(ArticleState.compareByDate);
  };

  public query ({ caller }) func getArticle(id : ArticleId) : async ArticleState {
    switch (articles.get(id)) {
      case (null) { Runtime.trap("Article not found") };
      case (?article) { article };
    };
  };
};

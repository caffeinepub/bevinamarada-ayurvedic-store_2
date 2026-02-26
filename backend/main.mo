import Principal "mo:core/Principal";
import Array "mo:core/Array";
import Map "mo:core/Map";
import Set "mo:core/Set";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Order "mo:core/Order";
import List "mo:core/List";
import Float "mo:core/Float";
import Option "mo:core/Option";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import Int "mo:core/Int";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type ProductId = Nat;
  type InquiryId = Nat;
  type SaleId = Nat;

  public type UserProfile = {
    name : Text;
  };

  public type Product = {
    id : ProductId;
    name : Text;
    category : Text;
    price : Float;
    stockQuantity : Nat;
    description : Text;
    imageUrl : Text;
    isHidden : Bool;
    status : ProductStatus;
  };

  public type ProductStatus = {
    #inStock;
    #outOfStock;
  };

  public type Inquiry = {
    id : InquiryId;
    name : Text;
    phone : Text;
    message : Text;
    productId : ?ProductId;
    timestamp : Int;
    isRead : Bool;
  };

  public type Sale = {
    id : SaleId;
    productId : ProductId;
    productName : Text;
    quantity : Nat;
    pricePerUnit : Float;
    totalAmount : Float;
    customerName : ?Text;
    phone : ?Text;
    saleDate : Int;
  };

  public type IncomeStats = {
    totalIncome : Float;
    todayIncome : Float;
    monthlyIncome : Float;
  };

  public type ProductInput = {
    name : Text;
    category : Text;
    price : Float;
    stockQuantity : Nat;
    description : Text;
    imageUrl : Text;
  };

  public type SaleInput = {
    productId : ProductId;
    quantity : Nat;
    customerName : ?Text;
    phone : ?Text;
  };

  public type InquiryInput = {
    name : Text;
    phone : Text;
    message : Text;
    productId : ?ProductId;
  };

  var nextProductId : ProductId = 1;
  var nextInquiryId : InquiryId = 1;
  var nextSaleId : SaleId = 1;
  var lowStockThreshold : Nat = 5;

  let products = Map.empty<ProductId, Product>();
  let inquiries = Map.empty<InquiryId, Inquiry>();
  let sales = Map.empty<SaleId, Sale>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  func getCurrentTimestamp() : Int {
    Time.now() / 1_000_000;
  };

  func determineStatus(stock : Nat) : ProductStatus {
    if (stock > 0) { #inStock } else { #outOfStock };
  };

  module ProductModule {
    public func compare(p1 : Product, p2 : Product) : Order.Order {
      Nat.compare(p1.id, p2.id);
    };

    public func compareByCategory(p1 : Product, p2 : Product) : Order.Order {
      switch (Text.compare(p1.category, p2.category)) {
        case (#equal) { Nat.compare(p1.id, p2.id) };
        case (order) { order };
      };
    };
  };

  module InquiryModule {
    public func compare(i1 : Inquiry, i2 : Inquiry) : Order.Order {
      Nat.compare(i1.id, i2.id);
    };
  };

  module SaleModule {
    public func compare(s1 : Sale, s2 : Sale) : Order.Order {
      Nat.compare(s1.id, s2.id);
    };
  };

  // User profile functions (required by instructions)
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get profiles");
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

  // Admin-only: create product
  public shared ({ caller }) func createProduct(product : ProductInput) : async ProductId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create products");
    };

    let id = nextProductId;
    nextProductId += 1;

    let newProduct : Product = {
      id;
      name = product.name;
      category = product.category;
      price = product.price;
      stockQuantity = product.stockQuantity;
      description = product.description;
      imageUrl = product.imageUrl;
      isHidden = false;
      status = determineStatus(product.stockQuantity);
    };

    products.add(id, newProduct);
    id;
  };

  // Admin-only: update product
  public shared ({ caller }) func updateProduct(id : ProductId, product : ProductInput) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update products");
    };

    if (not products.containsKey(id)) {
      Runtime.trap("Product does not exist");
    };

    let updatedProduct : Product = {
      id;
      name = product.name;
      category = product.category;
      price = product.price;
      stockQuantity = product.stockQuantity;
      description = product.description;
      imageUrl = product.imageUrl;
      isHidden = switch (products.get(id)) {
        case (null) { false };
        case (?existingProduct) { existingProduct.isHidden };
      };
      status = determineStatus(product.stockQuantity);
    };

    products.add(id, updatedProduct);
  };

  // Admin-only: delete product
  public shared ({ caller }) func deleteProduct(id : ProductId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete products");
    };

    products.remove(id);
  };

  // Public: browse products
  public query ({ caller }) func getProducts(hideOutOfStock : Bool) : async [Product] {
    let allProducts = products.values().toArray();

    let filtered = if (hideOutOfStock) {
      allProducts.filter(
        func(p) {
          p.stockQuantity > 0;
        }
      );
    } else { allProducts };

    filtered.sort();
  };

  // Public: get product by id
  public query ({ caller }) func getProductById(id : ProductId) : async ?Product {
    products.get(id);
  };

  // Public: submit inquiry (no auth required)
  public shared ({ caller }) func submitInquiry(input : InquiryInput) : async InquiryId {
    let id = nextInquiryId;
    nextInquiryId += 1;

    let newInquiry : Inquiry = {
      id;
      name = input.name;
      phone = input.phone;
      message = input.message;
      productId = input.productId;
      timestamp = getCurrentTimestamp();
      isRead = false;
    };

    inquiries.add(id, newInquiry);
    id;
  };

  // Admin-only: get all inquiries
  public query ({ caller }) func getInquiries() : async [Inquiry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view enquiries");
    };

    inquiries.values().toArray();
  };

  // Admin-only: mark inquiry as read
  public shared ({ caller }) func markInquiryRead(id : InquiryId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can mark enquiries as read");
    };

    let inquiry = inquiries.get(id);
    switch (inquiry) {
      case (null) { Runtime.trap("Inquiry does not exist") };
      case (?i) {
        let updated : Inquiry = {
          id = i.id;
          name = i.name;
          phone = i.phone;
          message = i.message;
          productId = i.productId;
          timestamp = i.timestamp;
          isRead = true;
        };
        inquiries.add(id, updated);
      };
    };
  };

  // Admin-only: delete inquiry
  public shared ({ caller }) func deleteInquiry(id : InquiryId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete enquiries");
    };

    inquiries.remove(id);
  };

  // Admin-only: record a sale
  public shared ({ caller }) func recordSale(input : SaleInput) : async SaleId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can record sales");
    };

    let product = products.get(input.productId);
    switch (product) {
      case (null) { Runtime.trap("Product does not exist") };
      case (?p) {
        if (input.quantity > p.stockQuantity) {
          Runtime.trap("Insufficient stock");
        };

        let newStock = p.stockQuantity - input.quantity;
        let totalAmount = p.price * (input.quantity.toInt()).toFloat();

        let updatedProduct : Product = {
          id = p.id;
          name = p.name;
          category = p.category;
          price = p.price;
          stockQuantity = newStock;
          description = p.description;
          imageUrl = p.imageUrl;
          isHidden = p.isHidden;
          status = determineStatus(newStock);
        };

        products.add(p.id, updatedProduct);

        let id = nextSaleId;
        nextSaleId += 1;

        let newSale : Sale = {
          id;
          productId = p.id;
          productName = p.name;
          quantity = input.quantity;
          pricePerUnit = p.price;
          totalAmount;
          customerName = input.customerName;
          phone = input.phone;
          saleDate = getCurrentTimestamp();
        };

        sales.add(id, newSale);
        id;
      };
    };
  };

  // Admin-only: get sales by date (day filter)
  public query ({ caller }) func getSalesByDate(dayTimestamp : Int) : async [Sale] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view sales");
    };

    let dayInSeconds = 86400;
    let startOfDay = (dayTimestamp / dayInSeconds) * dayInSeconds;
    let endOfDay = startOfDay + dayInSeconds;

    sales.values().toArray().filter(
      func(sale) {
        sale.saleDate >= startOfDay and sale.saleDate < endOfDay;
      }
    );
  };

  // Admin-only: get sales by month (year+month filter)
  public query ({ caller }) func getSalesByMonth(year : Nat, month : Nat) : async [Sale] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view sales");
    };

    // Approximate: filter by year and month using timestamp arithmetic
    // Using seconds since epoch; approximate month boundaries
    // year and month are calendar values (e.g. 2024, 1 for January)
    // We'll use a simple approach: filter sales whose saleDate falls in the given month
    let daysInMonth : Nat = 31;
    let secondsPerDay : Int = 86400;
    let secondsPerYear : Int = 31_536_000;
    let secondsPerMonth : Int = daysInMonth * secondsPerDay;

    // Approximate start of year: (year - 1970) * secondsPerYear
    let yearsFromEpoch : Nat = if (year > 1970) { year - 1970 } else { 0 };
    let approxYearStart : Int = yearsFromEpoch * secondsPerYear;
    let approxMonthStart : Int = approxYearStart + (if (month > 1) { (month - 1) * secondsPerMonth } else { 0 });
    let approxMonthEnd : Int = approxMonthStart + secondsPerMonth;

    sales.values().toArray().filter(
      func(sale) {
        sale.saleDate >= approxMonthStart and sale.saleDate < approxMonthEnd;
      }
    );
  };

  // Admin-only: get sales by product
  public query ({ caller }) func getSalesByProduct(productId : ProductId) : async [Sale] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view sales");
    };

    sales.values().toArray().filter(
      func(sale) {
        sale.productId == productId;
      }
    );
  };

  // Admin-only: get total income
  public query ({ caller }) func getTotalIncome() : async Float {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view income");
    };

    let allSales = sales.values().toArray();
    allSales.foldLeft(0.0, func(acc, sale) { acc + sale.totalAmount });
  };

  // Admin-only: get today's income
  public query ({ caller }) func getTodayIncome() : async Float {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view income");
    };

    let currentTime = getCurrentTimestamp();
    let dayInSeconds = 86400;
    let startOfToday = (currentTime / dayInSeconds) * dayInSeconds;

    let allSales = sales.values().toArray();
    allSales.filter(
      func(sale) {
        sale.saleDate >= startOfToday;
      }
    ).foldLeft(0.0, func(acc, sale) { acc + sale.totalAmount });
  };

  // Admin-only: get monthly income (last 30 days)
  public query ({ caller }) func getMonthlyIncome() : async Float {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view income");
    };

    let currentTime = getCurrentTimestamp();
    let monthInSeconds = 2592000;

    let allSales = sales.values().toArray();
    allSales.filter(
      func(sale) {
        sale.saleDate >= (currentTime - monthInSeconds);
      }
    ).foldLeft(0.0, func(acc, sale) { acc + sale.totalAmount });
  };

  // Admin-only: get income stats
  public query ({ caller }) func getIncomeStats() : async IncomeStats {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view income stats");
    };

    let allSales = sales.values().toArray();

    let currentTime = getCurrentTimestamp();
    let dayInSeconds = 86400;
    let monthInSeconds = 2592000;
    let startOfToday = (currentTime / dayInSeconds) * dayInSeconds;

    let totalIncome = allSales.foldLeft(0.0, func(acc, sale) { acc + sale.totalAmount });

    let todayIncome = allSales.filter(
      func(sale) {
        sale.saleDate >= startOfToday;
      }
    ).foldLeft(0.0, func(acc, sale) { acc + sale.totalAmount });

    let monthlyIncome = allSales.filter(
      func(sale) {
        sale.saleDate >= (currentTime - monthInSeconds);
      }
    ).foldLeft(0.0, func(acc, sale) { acc + sale.totalAmount });

    {
      totalIncome;
      todayIncome;
      monthlyIncome;
    };
  };

  // Admin-only: set low stock threshold
  public shared ({ caller }) func setLowStockThreshold(newThreshold : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can set low stock threshold");
    };

    lowStockThreshold := newThreshold;
  };

  // Admin-only: get low stock products
  public query ({ caller }) func getLowStockProducts() : async [Product] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view low stock alerts");
    };

    let filtered = products.values().toArray().filter(
      func(product) {
        product.stockQuantity > 0 and product.stockQuantity <= lowStockThreshold
      }
    );
    filtered;
  };
};

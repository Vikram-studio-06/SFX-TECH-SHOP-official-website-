/* =========================================================
   SFX TECH - APP.JS
   CLEAN VERSION
   ========================================================= */

/* =========================================================
   SUPABASE
   ========================================================= */

const SUPABASE_URL =
  "https://jpwcchkaduijgtvztmac.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_rRQ2FHgBvHeBhV3VS5P6Iw_T5mOdE1Y";

if (!window.supabase) {
  console.error("Supabase CDN load nahi hua.");
  alert("Supabase load nahi hua. Internet check karo.");
}

const supabaseClient =
  window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
  );

console.log("SFX TECH: app.js loaded successfully.");
console.log("Supabase client:", supabaseClient);


/* =========================================================
   GLOBAL FUNCTIONS
   ========================================================= */

window.showToast = function (message) {
  const toast = document.getElementById("toast");

  if (!toast) {
    alert(message);
    return;
  }

  const item = document.createElement("div");

  item.className = "toast-message";
  item.textContent = message;

  toast.appendChild(item);

  setTimeout(() => {
    item.remove();
  }, 3500);
};

/* =========================================================
   HAMBURGER MENU
   ========================================================= */

window.toggleMenu = function () {

  const menu =
    document.getElementById("mobileMenu");

  if (!menu) return;

  menu.classList.toggle("show");
};

/* =========================================================
   LOGIN / SIGNUP BOX
   ========================================================= */

window.showLogin = function () {

  const loginBox =
    document.getElementById("loginBox");

  const signupBox =
    document.getElementById("signupBox");

  if (loginBox) {
    loginBox.classList.remove("hidden");
  }

  if (signupBox) {
    signupBox.classList.add("hidden");
  }
};


window.showSignup = function () {

  const loginBox =
    document.getElementById("loginBox");

  const signupBox =
    document.getElementById("signupBox");

  if (loginBox) {
    loginBox.classList.add("hidden");
  }

  if (signupBox) {
    signupBox.classList.remove("hidden");
  }
};


/* =========================================================
   SIGNUP
   ========================================================= */

window.signupUser = async function () {

  console.log("SIGNUP FUNCTION STARTED");

  try {

    const name =
      document.getElementById("signupName")
        ?.value
        .trim();

    const email =
      document.getElementById("signupEmail")
        ?.value
        .trim();

    const password =
      document.getElementById("signupPassword")
        ?.value;

    console.log("Signup data:", {
      name,
      email
    });

    if (!name || !email || !password) {

      alert(
        "Name, email aur password fill karo."
      );

      return;
    }

    if (password.length < 6) {

      alert(
        "Password minimum 6 characters ka hona chahiye."
      );

      return;
    }

    console.log(
      "Creating Supabase account..."
    );

    const {
      data,
      error
    } =
      await supabaseClient.auth.signUp({
        email: email,
        password: password
      });

    console.log(
      "SUPABASE SIGNUP RESPONSE:",
      data,
      error
    );

    if (error) {

      console.error(
        "SIGNUP ERROR:",
        error
      );

      alert(
        "Signup Error:\n\n" +
        error.message
      );

      return;
    }

    if (!data || !data.user) {

      alert(
        "Account create nahi hua."
      );

      return;
    }

    /*
      IMPORTANT:

      Email confirmation ON hone par
      session turant nahi mil sakta.

      Isliye profile insert ko yahan
      force nahi kar rahe.
    */

    console.log(
      "USER CREATED:",
      data.user.id
    );

    if (data.session) {

      console.log(
        "Signup ke baad session available hai."
      );

      /*
        Profile create attempt
      */

      const {
        error: profileError
      } =
        await supabaseClient
          .from("profiles")
          .upsert({
            id: data.user.id,
            name: name,
            role: "customer"
          });

      if (profileError) {

        console.warn(
          "Profile insert warning:",
          profileError
        );
      }

      alert(
        "Account successfully create ho gaya!"
      );

      window.showLogin();

      return;
    }

    /*
      Email confirmation enabled
    */

    alert(
      "Account successfully create ho gaya.\n\n" +
      "Apne email inbox me verification link check karo.\n" +
      "Email verify karne ke baad login karo."
    );

    window.showLogin();

  } catch (error) {

    console.error(
      "SIGNUP CRASH:",
      error
    );

    alert(
      "Signup Error:\n\n" +
      error.message
    );
  }
};


/* =========================================================
   LOGIN
   ========================================================= */

window.loginUser = async function () {

  console.log(
    "LOGIN FUNCTION STARTED"
  );

  try {

    const emailInput =
      document.getElementById("loginEmail");

    const passwordInput =
      document.getElementById("loginPassword");

    if (!emailInput || !passwordInput) {

      alert(
        "Login fields nahi mile.\n" +
        "index.html check karo."
      );

      console.error(
        "loginEmail/loginPassword missing"
      );

      return;
    }

    const email =
      emailInput.value.trim();

    const password =
      passwordInput.value;

    if (!email || !password) {

      alert(
        "Email aur password enter karo."
      );

      return;
    }

    console.log(
      "LOGIN START:",
      email
    );

    const {
      data,
      error
    } =
      await supabaseClient.auth.signInWithPassword({
        email: email,
        password: password
      });

    console.log(
      "LOGIN RESPONSE:",
      data,
      error
    );

    if (error) {

      console.error(
        "LOGIN ERROR:",
        error
      );

      alert(
        "Login Error:\n\n" +
        error.message
      );

      return;
    }

    if (!data || !data.user) {

      alert(
        "Login failed: user nahi mila."
      );

      return;
    }

    console.log(
      "LOGIN SUCCESS:",
      data.user
    );

    alert(
      "Login successful!"
    );

    window.location.href =
      "index.html";

  } catch (error) {

    console.error(
      "LOGIN CRASH:",
      error
    );

    alert(
      "Login Error:\n\n" +
      error.message
    );
  }
};


/* =========================================================
   LOGOUT
   ========================================================= */

window.logoutUser = async function () {

  try {

    await supabaseClient.auth.signOut();

  } catch (error) {

    console.error(
      "LOGOUT ERROR:",
      error
    );
  }

  window.location.href =
    "index.html";
};


/* =========================================================
   CURRENT USER
   ========================================================= */

async function getCurrentUser() {

  const {
    data,
    error
  } =
    await supabaseClient.auth.getUser();

  if (error) {

    console.error(
      "GET USER ERROR:",
      error
    );

    return null;
  }

  return data?.user || null;
}


/* =========================================================
   PROFILE
   ========================================================= */

async function getProfile(userId) {

  const {
    data,
    error
  } =
    await supabaseClient
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

  if (error) {

    console.error(
      "PROFILE ERROR:",
      error
    );

    return null;
  }

  return data;
}


/* =========================================================
   PRODUCT ID
   ========================================================= */

function getProductId() {

  const params =
    new URLSearchParams(
      window.location.search
    );

  return params.get("id");
}


/* =========================================================
   PRICE
   ========================================================= */

function formatPrice(price) {

  return (
    "₹" +
    Number(price || 0).toFixed(0)
  );
}


/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapeHTML(value) {

  if (value === null ||
      value === undefined) {

    return "";
  }

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


function escapeAttribute(value) {

  return escapeHTML(value);
}


/* =========================================================
   INITIALIZE INDEX
   ========================================================= */

async function initializeIndex() {

  const authSection =
    document.getElementById(
      "authSection"
    );

  const mainSection =
    document.getElementById(
      "mainSection"
    );

  if (!authSection &&
      !mainSection) {

    return;
  }

  try {

    const user =
      await getCurrentUser();

    console.log(
      "CURRENT USER:",
      user
    );

    if (!user) {

      if (authSection) {
        authSection.classList.remove(
          "hidden"
        );
      }

      if (mainSection) {
        mainSection.classList.add(
          "hidden"
        );
      }

      return;
    }

    /*
      User logged in.
      Profile check.
    */

    const profile =
      await getProfile(user.id);

    console.log(
      "CURRENT PROFILE:",
      profile
    );

    /*
      Agar profile nahi mili,
      customer ko logout nahi karenge.
      Website chalne denge.
    */

    if (
      profile &&
      profile.role === "admin"
    ) {

      if (authSection) {
        authSection.classList.add(
          "hidden"
        );
      }

      if (mainSection) {
        mainSection.classList.add(
          "hidden"
        );
      }

      /*
        Admin ko admin.html par bhejo.
      */

      if (
        window.location.pathname.endsWith(
          "index.html"
        ) ||
        window.location.pathname === "/"
      ) {

        window.location.href =
          "admin.html";
      }

      return;
    }

    if (authSection) {
      authSection.classList.add(
        "hidden"
      );
    }

    if (mainSection) {
      mainSection.classList.remove(
        "hidden"
      );
    }

    await loadProducts();

  } catch (error) {

    console.error(
      "INITIALIZE INDEX ERROR:",
      error
    );
  }
}


/* =========================================================
   LOAD PRODUCTS
   ========================================================= */

async function loadProducts() {
  
  // ==========================================
  // PRODUCT IMAGES
  // ==========================================
  
  const productImages = [
    "the step.jpg",
    "price 39.jpg",
    "2017xml.jpg",
    "sponsorship.jpg"
  ];
  
  
  // ==========================================
  // PRODUCT GRID
  // ==========================================
  
  const grid =
    document.getElementById("productsGrid");
  
  if (!grid) {
    console.log("productsGrid nahi mila.");
    return;
  }
  
  
  // ==========================================
  // GET PRODUCTS FROM SUPABASE
  // ==========================================
  
  const {
    data,
    error
  } = await supabaseClient
    .from("products")
    .select("*")
    .order("id", {
      ascending: true
    });
  
  
  // ==========================================
  // ERROR
  // ==========================================
  
  if (error) {
    
    console.error(
      "PRODUCT ERROR:",
      error
    );
    
    grid.innerHTML = `
      <div class="empty">
        Unable to load products.
      </div>
    `;
    
    return;
  }
  
  
  // ==========================================
  // NO PRODUCTS
  // ==========================================
  
  if (!data || data.length === 0) {
    
    grid.innerHTML = `
      <div class="empty">
        No products available.
      </div>
    `;
    
    return;
  }
  
  
  // ==========================================
  // DISPLAY PRODUCTS
  // ==========================================
  
  grid.innerHTML = data.map(
    (product, index) => {
      
      // Database ke product ke order ke
      // according image select hogi
      
      const image =
        productImages[index] ||
        "sfx tech.jpg";
      
      
      return `
        <article class="product-card">

          <img
            src="${escapeAttribute(image)}"
            class="product-image"
            alt="${escapeHTML(product.name)}"
          >


          <div class="product-info">

            <h3>
              ${escapeHTML(product.name)}
            </h3>


            <p class="product-description">
              ${escapeHTML(
                product.description ||
                "Premium XML File"
              )}
            </p>


            <div class="price">
              ${formatPrice(product.price)}
            </div>


            <a
              href="product.html?id=${product.id}"
              class="primary-btn product-btn"
            >
              Buy Now
            </a>

          </div>

        </article>
      `;
      
    }
  ).join("");
}


/* =========================================================
   PRODUCT DETAILS
   ========================================================= */

async function loadProductDetails() {

  const container =
    document.getElementById(
      "productDetails"
    );

  if (!container) return;

  const user =
    await getCurrentUser();

  if (!user) {

    window.location.href =
      "index.html";

    return;
  }

  const productId =
    getProductId();

  if (!productId) {

    container.innerHTML =
      `<div class="empty">
        Product not found.
      </div>`;

    return;
  }

  const {
    data: product,
    error
  } =
    await supabaseClient
      .from("products")
      .select("*")
      .eq("id", productId)
      .single();

  if (error || !product) {

    console.error(
      "PRODUCT DETAIL ERROR:",
      error
    );

    container.innerHTML =
      `<div class="empty">
        Product not found.
      </div>`;

    return;
  }

  container.innerHTML = `

  <img
    src="${escapeAttribute(product.image_url)}"
    class="product-detail-image"
    alt="${escapeHTML(product.name)}"
  >

  <div class="product-detail-info">

    <p class="small-label">
      SFX TECH XML
    </p>

    <h1>
      ${escapeHTML(product.name)}
    </h1>

    <p>
      ${escapeHTML(
        product.description ||
        "Premium video editing XML file."
      )}
    </p>

    <div class="price">
      ${formatPrice(product.price)}
    </div>

    <a
      href="payment.html?id=${product.id}"
      class="primary-btn"
    >
      Buy Now
    </a>

  </div>

`;
}


/* =========================================================
   PAYMENT
   ========================================================= */

let selectedProduct = null;


async function loadPaymentPage() {
  
  const container =
    document.getElementById("paymentProduct");
  
  if (!container) return;
  
  // Initially loading
  container.innerHTML = `
    <div class="loading">
      Loading product...
    </div>
  `;
  
  try {
    
    /* ================================
       CHECK LOGIN
       ================================ */
    
    const user = await getCurrentUser();
    
    console.log("PAYMENT USER:", user);
    
    if (!user) {
      window.location.href = "index.html";
      return;
    }
    
    
    /* ================================
       GET PRODUCT ID FROM URL
       ================================ */
    
    const productId = getProductId();
    
    console.log(
      "PAYMENT PRODUCT ID:",
      productId
    );
    
    if (!productId) {
      
      container.innerHTML = `
        <div class="empty">
          Product ID nahi mila.
        </div>
      `;
      
      return;
    }
    
    
    /* ================================
       LOAD PRODUCT FROM SUPABASE
       ================================ */
    
    const {
      data: product,
      error
    } = await supabaseClient
      .from("products")
      .select("*")
      .eq("id", productId)
      .single();
    
    
    console.log(
      "PAYMENT PRODUCT:",
      product
    );
    
    console.log(
      "PAYMENT PRODUCT ERROR:",
      error
    );
    
    
    /* ================================
       DATABASE ERROR
       ================================ */
    
    if (error) {
      
      console.error(
        "PAYMENT PRODUCT ERROR:",
        error
      );
      
      container.innerHTML = `
        <div class="empty">
          Product load nahi hua.
          <br><br>
          ${escapeHTML(error.message)}
        </div>
      `;
      
      return;
    }
    
    
    /* ================================
       PRODUCT NOT FOUND
       ================================ */
    
    if (!product) {
      
      container.innerHTML = `
        <div class="empty">
          Product not found.
        </div>
      `;
      
      return;
    }
    
    
    /* ================================
       SAVE SELECTED PRODUCT
       ================================ */
    
    selectedProduct = product;
    
    
    /* ================================
       SHOW PRODUCT
       ================================ */
    
    container.innerHTML = `

      <div class="payment-product">

        <div class="payment-product-info">

          <span class="payment-label">
            Product
          </span>

          <h3>
            ${escapeHTML(product.name)}
          </h3>

        </div>

        <strong class="payment-price">
          ${formatPrice(product.price)}
        </strong>

      </div>

    `;
    
    
    console.log(
      "PAYMENT PRODUCT LOADED SUCCESSFULLY:",
      product.name,
      product.price
    );
    
    
    /* ================================
       PAYMENT SCREENSHOT INPUT
       ================================ */
    
    const fileInput =
      document.getElementById(
        "paymentScreenshot"
      );
    
    if (fileInput) {
      
      fileInput.addEventListener(
        "change",
        () => {
          
          const file =
            fileInput.files?.[0];
          
          const fileName =
            document.getElementById(
              "fileName"
            );
          
          if (fileName) {
            
            fileName.textContent =
              file ?
              file.name :
              "No file selected";
            
          }
          
        }
      );
      
    }
    
  } catch (error) {
    
    console.error(
      "LOAD PAYMENT PRODUCT ERROR:",
      error
    );
    
    container.innerHTML = `
      <div class="empty">
        Product load karne me error.
        <br><br>
        ${escapeHTML(error.message)}
      </div>
    `;
    
  }
  
}


/* =========================================================
   SUBMIT PAYMENT
   ========================================================= */

window.submitPayment = async function () {

  const user =
    await getCurrentUser();

  if (!user) {

    window.showToast(
      "Please login first."
    );

    return;
  }

  if (!selectedProduct) {

    window.showToast(
      "Product not loaded."
    );

    return;
  }

  const fileInput =
    document.getElementById(
      "paymentScreenshot"
    );

  const file =
    fileInput?.files?.[0];

  if (!file) {

    window.showToast(
      "Please upload payment screenshot."
    );

    return;
  }

  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp"
  ];

  if (!allowedTypes.includes(
    file.type
  )) {

    window.showToast(
      "Only JPG, PNG and WEBP images are allowed."
    );

    return;
  }

  if (
    file.size >
    5 * 1024 * 1024
  ) {

    window.showToast(
      "Screenshot must be under 5MB."
    );

    return;
  }

  const button =
    document.getElementById(
      "submitPaymentBtn"
    );

  if (button) {

    button.disabled = true;

    button.textContent =
      "Uploading...";
  }

  try {

    const extension =
      file.name
        .split(".")
        .pop()
        .toLowerCase();

    const filePath =
      `${user.id}/${crypto.randomUUID()}.${extension}`;

    const {
      error: uploadError
    } =
      await supabaseClient
        .storage
        .from("payment-screenshots")
        .upload(
          filePath,
          file,
          {
            cacheControl: "3600",
            upsert: false
          }
        );

    if (uploadError) {

      console.error(
        "UPLOAD ERROR:",
        uploadError
      );

      window.showToast(
        "Screenshot upload failed:\n" +
        uploadError.message
      );

      if (button) {

        button.disabled =
          false;

        button.textContent =
          "Submit Payment";
      }

      return;
    }

    const {
      error: orderError
    } =
      await supabaseClient
        .from("orders")
        .insert({

          user_id: user.id,

          product_id:
            selectedProduct.id,

          amount:
            selectedProduct.price,

          payment_screenshot:
            filePath,

          status:
            "pending"
        });

    if (orderError) {

      console.error(
        "ORDER ERROR:",
        orderError
      );

      await supabaseClient
        .storage
        .from("payment-screenshots")
        .remove([
          filePath
        ]);

      window.showToast(
        "Order creation failed:\n" +
        orderError.message
      );

      if (button) {

        button.disabled =
          false;

        button.textContent =
          "Submit Payment";
      }

      return;
    }

    window.showToast(
      "Payment submitted. Waiting for admin approval."
    );

    setTimeout(() => {

      window.location.href =
        "downloads.html";

    }, 1200);

  } catch (error) {

    console.error(
      "PAYMENT ERROR:",
      error
    );

    window.showToast(
      "Something went wrong:\n" +
      error.message
    );

    if (button) {

      button.disabled =
        false;

      button.textContent =
        "Submit Payment";
    }
  }
};


/* =========================================================
   DOWNLOADS
   ========================================================= */

async function loadDownloads() {

  const container =
    document.getElementById(
      "downloadsList"
    );

  if (!container) return;

  const user =
    await getCurrentUser();

  if (!user) {

    window.location.href =
      "index.html";

    return;
  }

  const {
    data: orders,
    error
  } =
    await supabaseClient
      .from("orders")
      .select(`
        id,
        amount,
        status,
        created_at,
        products (
          id,
          name,
          image_url,
          drive_url
        )
      `)
      .eq(
        "user_id",
        user.id
      )
      .order(
        "created_at",
        {
          ascending: false
        }
      );

  if (error) {

    console.error(
      "DOWNLOAD ERROR:",
      error
    );

    container.innerHTML =
      `<div class="empty">
        Unable to load orders.
      </div>`;

    return;
  }

  if (!orders ||
      orders.length === 0) {

    container.innerHTML =
      `<div class="empty">
        You haven't purchased anything yet.
      </div>`;

    return;
  }

  container.innerHTML =
    orders.map(order => {

      const product =
        order.products;

      let action = "";

      if (
        order.status ===
        "approved"
      ) {

        action = `

          <a
            class="primary-btn"
            href="${escapeAttribute(
              product?.drive_url ||
              "#"
            )}"
            target="_blank"
            rel="noopener noreferrer"
          >
            Download XML
          </a>

        `;

      } else if (
        order.status ===
        "pending"
      ) {

        action = `

          <span class="status pending">
            Payment Pending
          </span>

        `;

      } else {

        action = `

          <span class="status rejected">
            Payment Rejected
          </span>

        `;
      }

      return `

        <div class="download-card">

          <div>

            <h3>
              ${escapeHTML(
                product?.name ||
                "XML Product"
              )}
            </h3>

            <p>
              Amount:
              ${formatPrice(
                order.amount
              )}
            </p>

            <p>
              ${new Date(
                order.created_at
              ).toLocaleString()}
            </p>

            <span
              class="status ${escapeAttribute(
                order.status
              )}"
            >
              ${escapeHTML(
                order.status
              )}
            </span>

          </div>

          <div>
            ${action}
          </div>

        </div>

      `;

    }).join("");
}


/* =========================================================
   TEST LOGIN
   ========================================================= */

window.testLogin = function () {

  console.log(
    "TEST LOGIN BUTTON CLICKED"
  );

  const email =
    document.getElementById(
      "loginEmail"
    )?.value;

  const password =
    document.getElementById(
      "loginPassword"
    )?.value;

  console.log(
    "Email:",
    email
  );

  console.log(
    "Password entered:",
    !!password
  );

  if (
    typeof window.loginUser !==
    "function"
  ) {

    alert(
      "ERROR: loginUser function load nahi hui."
    );

    return;
  }

  window.loginUser();
};

/* =========================================================
   PAGE INITIALIZATION
   ========================================================= */

document.addEventListener("DOMContentLoaded", async () => {

  console.log("SFX TECH DOM READY");

  try {

    /* =========================
       INDEX PAGE
       ========================= */

    const productsGrid =
      document.getElementById("productsGrid");

    if (productsGrid) {

      console.log(
        "SFX TECH: Index page detected"
      );

      await initializeIndex();

      console.log(
        "SFX TECH: loading products..."
      );

      await loadProducts();
    }


    /* =========================
       PRODUCT DETAILS PAGE
       ========================= */

    const productDetails =
      document.getElementById(
        "productDetails"
      );

    if (productDetails) {

      console.log(
        "SFX TECH: Product page detected"
      );

      await loadProductDetails();
    }


    /* =========================
       PAYMENT PAGE
       ========================= */

    const paymentProduct =
      document.getElementById(
        "paymentProduct"
      );

    if (paymentProduct) {

      console.log(
        "SFX TECH: Payment page detected"
      );

      await loadPaymentPage();
    }


    /* =========================
       DOWNLOADS PAGE
       ========================= */

    const downloadsList =
      document.getElementById(
        "downloadsList"
      );

    if (downloadsList) {

  console.log(
    "SFX TECH: Downloads page detected"
  );

  await loadDownloads();
}


/* =========================
   ADMIN MENU
   ========================= */

await setupAdminMenu();


console.log(
  "SFX TECH INITIALIZATION COMPLETE"
);

  } catch (error) {

    console.error(
      "SFX TECH INITIALIZATION ERROR:",
      error
    );

  }

});
/* =========================================================
   ADMIN DATA
   ========================================================= */

window.loadAdminData = async function () {

  console.log("SFX TECH: ADMIN DATA LOADING...");

  const ordersBox =
    document.getElementById("adminOrders");

  const activityBox =
    document.getElementById("activityList");

  if (!ordersBox || !activityBox) {

    console.error(
      "Admin orders/activity element nahi mila."
    );

    return;
  }

  ordersBox.innerHTML = `
    <div class="loading">
      Loading orders...
    </div>
  `;

  activityBox.innerHTML = `
    <div class="loading">
      Loading activity...
    </div>
  `;

  try {

    /* =========================
       CHECK USER
       ========================= */

    const user =
      await getCurrentUser();

    if (!user) {

      window.location.href =
        "index.html";

      return;
    }


    /* =========================
       CHECK ADMIN
       ========================= */

    const profile =
      await getProfile(user.id);

    console.log(
      "ADMIN DATA PROFILE:",
      profile
    );

    if (
      !profile ||
      profile.role !== "admin"
    ) {

      alert("Access Denied");

      window.location.href =
        "index.html";

      return;
    }


    /* =========================
       LOAD ORDERS
       ========================= */

    const {
      data: orders,
      error: ordersError
    } =
      await supabaseClient
        .from("orders")
        .select(`
          id,
          user_id,
          product_id,
          amount,
          payment_screenshot,
          status,
          created_at,
          products (
            id,
            name,
            price,
            image_url,
            drive_url
          )
        `)
        .order(
          "created_at",
          {
            ascending: false
          }
        );


    if (ordersError) {

      console.error(
        "ADMIN ORDERS ERROR:",
        ordersError
      );

      ordersBox.innerHTML = `
        <div class="empty">

          <strong>
            Orders load nahi ho rahe.
          </strong>

          <br><br>

          ${escapeHTML(
            ordersError.message
          )}

        </div>
      `;

      activityBox.innerHTML = `
        <div class="empty">
          Activity load nahi ho saki.
        </div>
      `;

      return;
    }


    console.log(
      "ADMIN ORDERS:",
      orders
    );


    /* =========================
       COUNTS
       ========================= */

    const pending =
      (orders || []).filter(
        order =>
          order.status === "pending"
      ).length;

    const approved =
      (orders || []).filter(
        order =>
          order.status === "approved"
      ).length;

    const rejected =
      (orders || []).filter(
        order =>
          order.status === "rejected"
      ).length;


    const pendingCount =
      document.getElementById(
        "pendingCount"
      );

    const approvedCount =
      document.getElementById(
        "approvedCount"
      );

    const rejectedCount =
      document.getElementById(
        "rejectedCount"
      );


    if (pendingCount) {
      pendingCount.textContent =
        pending;
    }

    if (approvedCount) {
      approvedCount.textContent =
        approved;
    }

    if (rejectedCount) {
      rejectedCount.textContent =
        rejected;
    }


    /* =========================
       NO ORDERS
       ========================= */

    if (
      !orders ||
      orders.length === 0
    ) {

      ordersBox.innerHTML = `
        <div class="empty">
          No customer orders found.
        </div>
      `;

      activityBox.innerHTML = `
        <div class="empty">
          No activity yet.
        </div>
      `;

      return;
    }


    /* =========================
       BUILD ORDER CARDS
       ========================= */

    let ordersHTML = "";


    for (const order of orders) {

      const product =
        order.products || {};

      const status =
        String(
          order.status || "pending"
        ).toLowerCase();


      let screenshotHTML =
        `<span>No screenshot</span>`;


      /* =========================
         PAYMENT SCREENSHOT
         ========================= */

      if (
        order.payment_screenshot
      ) {

        const {
          data: signedData,
          error: signedError
        } =
          await supabaseClient
            .storage
            .from(
              "payment-screenshots"
            )
            .createSignedUrl(
              order.payment_screenshot,
              3600
            );


        if (
          !signedError &&
          signedData?.signedUrl
        ) {

          screenshotHTML = `
  <img
    src="${escapeAttribute(
      signedData.signedUrl
    )}"
    alt="Payment Screenshot"
    onclick="openPaymentScreenshot('${escapeAttribute(
      signedData.signedUrl
    )}')"
    style="
      width:120px;
      height:120px;
      object-fit:cover;
      border-radius:12px;
      cursor:pointer;
      display:block;
    "
  >
`;

        }

      }


      /* =========================
         ACTION BUTTONS
         ========================= */

      let actionHTML = "";


      if (status === "pending") {

        actionHTML = `

          <button
            type="button"
            class="primary-btn"
            onclick="approveOrder('${escapeAttribute(
              order.id
            )}')"
          >
            ✓ Approve
          </button>


          <button
            type="button"
            class="logout-btn"
            onclick="rejectOrder('${escapeAttribute(
              order.id
            )}')"
          >
            ✕ Reject
          </button>

        `;

      } else {

        actionHTML = `
          <span>
            Order ${escapeHTML(
              status
            )}
          </span>
        `;

      }


      /* =========================
         ORDER CARD
         ========================= */

      ordersHTML += `

        <article class="admin-order-card">

          <div class="admin-order-header">

            <div>

              <p class="small-label">
                ORDER
              </p>

              <strong>
                #${escapeHTML(
                  String(order.id)
                )}
              </strong>

            </div>


            <span class="order-status ${escapeAttribute(
              status
            )}">
              ${escapeHTML(
                status.toUpperCase()
              )}
            </span>

          </div>


          <div class="admin-order-body">

            <div>

              <h3>
                ${escapeHTML(
                  product.name ||
                  "Unknown Product"
                )}
              </h3>


              <p>
                Amount:
                <strong>
                  ${formatPrice(
                    order.amount
                  )}
                </strong>
              </p>


              <p>
                Customer ID:
                ${escapeHTML(
                  order.user_id
                )}
              </p>


              <p>
                Order Date:
                ${new Date(
                  order.created_at
                ).toLocaleString()}
              </p>

            </div>


            <div class="payment-proof">

              <p class="small-label">
                PAYMENT PROOF
              </p>

              ${screenshotHTML}

            </div>

          </div>


          <div class="admin-order-actions">

            ${actionHTML}

          </div>

        </article>

      `;

    }


    ordersBox.innerHTML =
      ordersHTML;


    /* =========================
       ACTIVITY
       ========================= */

    let activityHTML = "";


    for (const order of orders) {

      const product =
        order.products || {};


      activityHTML += `

        <div class="activity-item">

          <strong>
            ${escapeHTML(
              String(
                order.status ||
                "pending"
              ).toUpperCase()
            )}
          </strong>

          <span>
            ${escapeHTML(
              product.name ||
              "Unknown Product"
            )}
          </span>

          <small>
            ${new Date(
              order.created_at
            ).toLocaleString()}
          </small>

        </div>

      `;

    }


    activityBox.innerHTML =
      activityHTML;


    console.log(
      "SFX TECH: ADMIN DATA LOADED SUCCESSFULLY"
    );


  } catch (error) {

    console.error(
      "ADMIN DATA ERROR:",
      error
    );


    ordersBox.innerHTML = `
      <div class="empty">

        Admin data load error.

        <br><br>

        ${escapeHTML(
          error.message
        )}

      </div>
    `;


    activityBox.innerHTML = `
      <div class="empty">

        Activity load error.

        <br><br>

        ${escapeHTML(
          error.message
        )}

      </div>
    `;

  }

};


/* =========================================================
   APPROVE ORDER
   APPROVE → DELETE PAYMENT SCREENSHOT
   XML / ORDER WILL NOT BE DELETED
   ========================================================= */

window.approveOrder = async function (orderId) {

  const confirmed = confirm(
    "Approve karne ke baad payment screenshot delete ho jayega. Continue?"
  );

  if (!confirmed) {
    return;
  }

  try {

    /* =========================
       CHECK ADMIN
       ========================= */

    const user = await getCurrentUser();

    if (!user) {
      window.showToast("Please login first.");
      return;
    }

    const profile = await getProfile(user.id);

    if (!profile || profile.role !== "admin") {
      window.showToast("Access Denied.");
      return;
    }


    /* =========================
       GET ORDER + SCREENSHOT PATH
       ========================= */

    const {
      data: order,
      error: fetchError
    } = await supabaseClient
      .from("orders")
      .select("id, payment_screenshot, status")
      .eq("id", orderId)
      .single();

    if (fetchError || !order) {

      console.error(
        "GET ORDER ERROR:",
        fetchError
      );

      window.showToast(
        "Order nahi mila."
      );

      return;
    }


    /* =========================
       APPROVE ORDER
       ========================= */

    const {
      error: approveError
    } = await supabaseClient
      .from("orders")
      .update({
        status: "approved"
      })
      .eq("id", orderId);

    if (approveError) {

      console.error(
        "APPROVE ERROR:",
        approveError
      );

      window.showToast(
        "Approve failed: " +
        approveError.message
      );

      return;
    }


    /* =========================
       DELETE PAYMENT SCREENSHOT
       ========================= */

    if (order.payment_screenshot) {

      const {
        error: deleteError
      } = await supabaseClient
        .storage
        .from("payment-screenshots")
        .remove([
          order.payment_screenshot
        ]);

      if (deleteError) {

        console.error(
          "SCREENSHOT DELETE ERROR:",
          deleteError
        );

        window.showToast(
          "Order approved, but screenshot delete nahi hua."
        );

      } else {

        console.log(
          "PAYMENT SCREENSHOT DELETED:",
          order.payment_screenshot
        );

      }
    }


    /* =========================
       REMOVE SCREENSHOT PATH
       ========================= */

    const {
      error: clearError
    } = await supabaseClient
      .from("orders")
      .update({
        payment_screenshot: null
      })
      .eq("id", orderId);

    if (clearError) {

      console.error(
        "CLEAR SCREENSHOT PATH ERROR:",
        clearError
      );

    }


    /* =========================
       SUCCESS
       ========================= */

    window.showToast(
      "Order approved. Payment screenshot deleted."
    );

    await loadAdminData();

  } catch (error) {

    console.error(
      "APPROVE CRASH:",
      error
    );

    window.showToast(
      "Something went wrong:\n" +
      error.message
    );

  }

};


/* =========================================================
   REJECT ORDER
   REJECT → DELETE PAYMENT SCREENSHOT
   ========================================================= */

window.rejectOrder = async function (orderId) {

  const confirmed = confirm(
    "Reject karne ke baad payment screenshot delete ho jayega. Continue?"
  );

  if (!confirmed) {
    return;
  }

  try {

    const user = await getCurrentUser();

    if (!user) {
      window.showToast("Please login first.");
      return;
    }

    const profile = await getProfile(user.id);

    if (!profile || profile.role !== "admin") {
      window.showToast("Access Denied.");
      return;
    }


    // Get order screenshot path

    const {
      data: order,
      error: fetchError
    } = await supabaseClient
      .from("orders")
      .select("payment_screenshot")
      .eq("id", orderId)
      .single();


    if (fetchError || !order) {

      window.showToast(
        "Order nahi mila."
      );

      return;
    }


    // Update status rejected

    const {
      error: rejectError
    } = await supabaseClient
      .from("orders")
      .update({
        status: "rejected"
      })
      .eq("id", orderId);


    if (rejectError) {

      console.error(
        "REJECT ERROR:",
        rejectError
      );

      window.showToast(
        "Reject failed: " +
        rejectError.message
      );

      return;
    }


    // Delete screenshot

    if (order.payment_screenshot) {

      const {
        error: deleteError
      } = await supabaseClient
        .storage
        .from("payment-screenshots")
        .remove([
          order.payment_screenshot
        ]);


      if (deleteError) {

        console.error(
          "SCREENSHOT DELETE ERROR:",
          deleteError
        );

      }

    }


    // Remove screenshot path

    await supabaseClient
      .from("orders")
      .update({
        payment_screenshot: null
      })
      .eq("id", orderId);



    window.showToast(
      "Order rejected. Payment screenshot deleted."
    );


    await loadAdminData();


  } catch (error) {

    console.error(
      "REJECT CRASH:",
      error
    );

    window.showToast(
      "Something went wrong."
    );

  }

};
/* =========================================================
   PAYMENT SCREENSHOT PREVIEW
   ========================================================= */

window.openPaymentScreenshot = function (imageUrl) {

  let modal =
    document.getElementById(
      "paymentScreenshotModal"
    );

  if (!modal) {

    modal =
      document.createElement("div");

    modal.id =
      "paymentScreenshotModal";

    modal.innerHTML = `

      <div
        onclick="closePaymentScreenshot()"
        style="
          position:fixed;
          inset:0;
          background:rgba(0,0,0,0.85);
          display:flex;
          align-items:center;
          justify-content:center;
          padding:20px;
          z-index:99999;
        "
      >

        <div
          onclick="event.stopPropagation()"
          style="
            position:relative;
            max-width:95vw;
            max-height:95vh;
          "
        >

          <button
            type="button"
            onclick="closePaymentScreenshot()"
            style="
              position:absolute;
              top:-15px;
              right:-15px;
              width:40px;
              height:40px;
              border:0;
              border-radius:50%;
              background:white;
              color:black;
              font-size:25px;
              cursor:pointer;
              z-index:2;
            "
          >
            ×
          </button>

          <img
            id="paymentScreenshotLarge"
            src=""
            alt="Payment Screenshot"
            style="
              display:block;
              max-width:95vw;
              max-height:90vh;
              width:auto;
              height:auto;
              object-fit:contain;
              border-radius:12px;
              background:white;
            "
          >

        </div>

      </div>
    `;

    document.body.appendChild(modal);
  }

  document.getElementById(
    "paymentScreenshotLarge"
  ).src = imageUrl;

  modal.style.display = "block";
};


/* =========================================================
   CLOSE SCREENSHOT
   ========================================================= */

window.closePaymentScreenshot = function () {

  const modal =
    document.getElementById(
      "paymentScreenshotModal"
    );

  if (!modal) return;

  modal.style.display = "none";

  const image =
    document.getElementById(
      "paymentScreenshotLarge"
    );

  if (image) {
    image.src = "";
  }
};
async function setupAdminMenu() {

  const adminLink =
    document.getElementById("adminMenuLink");

  if (!adminLink) return;

  try {

    const user =
      await getCurrentUser();

    if (!user) {
      adminLink.style.display = "none";
      return;
    }

    const profile =
      await getProfile(user.id);

    if (
      profile &&
      profile.role === "admin"
    ) {

      adminLink.style.display = "flex";

      console.log(
        "SFX TECH: ADMIN MENU ENABLED"
      );

    } else {

      adminLink.style.display = "none";

    }

  } catch (error) {

    console.error(
      "ADMIN MENU ERROR:",
      error
    );

    adminLink.style.display = "none";

  }
}
/* =========================================================
   COPY UPI ID
   ========================================================= */

window.copyUPI = function () {

  const upi =
    document.getElementById("upiId")?.textContent.trim();

  if (!upi) {
    alert("UPI ID nahi mili.");
    return;
  }


  navigator.clipboard.writeText(upi)
    .then(() => {

      window.showToast(
        "UPI ID copied!"
      );

    })
    .catch(() => {

      alert(
        "Copy nahi hua."
      );

    });

};
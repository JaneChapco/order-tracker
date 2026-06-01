let orderNo = 0;

const order = {};
const buttons = document.querySelectorAll(".menu-item");
const orderSummary = document.getElementById("order-summary");
const orderTotal = document.getElementById("order-total");
const deliveryTotal = document.getElementById("delivery-total");

buttons.forEach((button) => {
  button.addEventListener("click", function () {
    const name = button.dataset.name;
    const price = Number(button.dataset.price);

    if (order[name]) {
      order[name].quantity++;
    } else {
      order[name] = {
        price: price,
        quantity: 1,
      };
    }

    updateOrderSummary();
  });
});

function updateOrderSummary() {
  orderSummary.innerHTML = "";

  let total = 0;

  for (let itemName in order) {
    const item = order[itemName];
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between";
    li.innerText = `${itemName} x ${item.quantity} - $${itemTotal.toFixed(2)}`;

    orderSummary.appendChild(li);
  }

  orderTotal.innerText = total.toFixed(2);
  deliveryTotal.innerText = (total + 4).toFixed(2);
}

const orderBeingPrepared = (orderNo) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      document.getElementById(`order-status-img-${orderNo}`).src =
        "assets/order-being-prepared.gif";
      document.getElementById(`order-status-text-${orderNo}`).innerText =
        "Order is being prepared";
      resolve(orderNo);
    }, 2000);
  });

const orderPrepared = (orderNo) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      document.getElementById(`order-status-img-${orderNo}`).src =
        "assets/order-prepared.gif";
      document.getElementById(`order-status-text-${orderNo}`).innerText =
        "Order prepared";
      resolve(orderNo);
    }, 10000);
  });

const orderHandedOver = (orderNo) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      document.getElementById(`order-status-img-${orderNo}`).src =
        "assets/order-handed-over.gif";
      document.getElementById(`order-status-text-${orderNo}`).innerText =
        "Order handed over to the delivery person";
      resolve(orderNo);
    }, 5000);
  });

const orderOnTheWay = (orderNo) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      document.getElementById(`order-status-img-${orderNo}`).src =
        "assets/order-on-the-way.gif";
      document.getElementById(`order-status-text-${orderNo}`).innerText =
        "Order is on the way";
      resolve(orderNo);
    }, 3000);
  });

const orderReachedDestination = (orderNo) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      document.getElementById(`order-status-img-${orderNo}`).src =
        "assets/order-reached-destination.gif";
      document.getElementById(`order-status-text-${orderNo}`).innerText =
        `Order reached its destination`;
      resolve(orderNo);
    }, 8000);
  });

const orderDelivered = (orderNo) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      document.getElementById(`order-status-img-${orderNo}`).src =
        "assets/order-delivered.gif";
      document.getElementById(`order-status-text-${orderNo}`).innerText =
        "Order has been delivered";
      resolve(orderNo);
    }, 4000);
  });

const placeOrder = () => {
  const customerName = document.getElementById("customer-name").value;

  if (customerName.trim() === "") {
    alert("Please enter a customer name.");
    return;
  }

  if (Object.keys(order).length === 0) {
    alert("Please add at least one item.");
    return;
  }

  orderNo++;

  createOrderCard(customerName);

  document.getElementById(`order-status-img-${orderNo}`).src =
    "assets/order-confirmed.gif";
  document.getElementById(`order-status-text-${orderNo}`).innerText =
    "Order confirmed";

  orderBeingPrepared(orderNo)
    .then((orderNo) => orderPrepared(orderNo))
    .then((orderNo) => orderHandedOver(orderNo))
    .then((orderNo) => orderOnTheWay(orderNo))
    .then((orderNo) => orderReachedDestination(orderNo))
    .then((orderNo) => orderDelivered(orderNo))
    .then((orderNo) => console.log(`Order ID 2026050000${orderNo} processed!`))
    .catch(() => console.log("Something went wrong"));
};

function createOrderCard(customerName) {
  const orderList = document.getElementById("order-list");

  const colDiv = document.createElement("div");
  colDiv.classList.add("col", "mt-4");

  const cardDiv = document.createElement("div");
  cardDiv.classList.add("card", "text-center", "w-100", "shadow-sm");

  const cardHeaderDiv = document.createElement("div");
  cardHeaderDiv.classList.add("card-header");
  cardHeaderDiv.innerHTML = `
  <div class="fw-bold">Order ID: 20260600${orderNo}</div>
  <small>Customer: ${customerName}</small>
`;

  const cardBodyDiv = document.createElement("div");
  cardBodyDiv.classList.add("card-body");

  const cardFooterDiv = document.createElement("div");
  cardFooterDiv.classList.add("card-footer", "text-body-secondary");
  cardFooterDiv.innerText = new Date().toLocaleString();

  // Collect form details
  const itemsListUl = document.createElement("ul");
  itemsListUl.classList.add("list-group", "list-group-flush");

  let total = 0;

  for (let itemName in order) {
    const item = order[itemName];

    const quantity = item.quantity;
    const price = item.price;
    const itemTotal = quantity * price;

    total += itemTotal;

    const li = document.createElement("li");
    li.classList.add("list-group-item", "d-flex", "justify-content-between");

    li.innerHTML = `
    <span>${itemName} (${quantity})</span>
    <span>$${itemTotal.toFixed(2)}</span>
  `;

    itemsListUl.appendChild(li);
  }

  const totalLi = document.createElement("li");
  totalLi.classList.add(
    "list-group-item",
    "d-flex",
    "justify-content-between",
    "fw-bold",
  );

  const deliveryTotal = total + 4;

  totalLi.innerHTML = `
  <div>
    <div>Delivery</div>
    <div>Total</div>
  </div>
  <div>
    <div>$4.00</div>
    <div>$${deliveryTotal.toFixed(2)}</div>
  </div>
`;

  for (let itemName in order) {
    delete order[itemName];
  }

  updateOrderSummary();

  itemsListUl.appendChild(totalLi);

  const hr = document.createElement("hr");

  const orderStatusDiv = document.createElement("div");

  const orderStatusImg = document.createElement("img");
  orderStatusImg.width = 80;
  orderStatusImg.id = `order-status-img-${orderNo}`;
  const orderStatusText = document.createElement("p");
  orderStatusText.classList.add("fs-5");
  orderStatusText.id = `order-status-text-${orderNo}`;

  orderStatusDiv.append(orderStatusImg, orderStatusText);

  const cancelOrderBtn = document.createElement("a");
  cancelOrderBtn.classList.add("btn", "btn-danger", "btn-sm");
  cancelOrderBtn.innerText = "Cancel";
  cancelOrderBtn.addEventListener("click", () => {
    colDiv.remove();
  });

  cardBodyDiv.append(itemsListUl, hr, orderStatusDiv, cancelOrderBtn);

  cardDiv.append(cardHeaderDiv, cardBodyDiv, cardFooterDiv);

  colDiv.append(cardDiv);

  orderList.append(colDiv);
}

/*
  - Project: Order tracking app
    - Instantly: Order confirmed ✅
    - After 2 seconds: Order is being prepared 🍜
    - After 10 seconds: Order prepared 🎉
    - After 5 seconds: Order handed over to the delivery person 📦
    - After 3 seconds: Order is on the way 🚴
    - After 8 seconds: Order reached it's destination 📍
    - After 4 seconds: Order has been delivered 😋

    Total order processing time: 2+10+5+3+8+4 = 32 seconds
*/

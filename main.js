// Dynamically include navbar and footer
function includeHTML(id, file) {
  fetch(file)
    .then(res => res.text())
    .then(data => {
      document.getElementById(id).innerHTML = data;
    });
}

// Estimate Modal Logic
let estimateModal;
document.addEventListener('DOMContentLoaded', function() {
  includeHTML('navbar-include', 'navbar.html');
  includeHTML('footer-include', 'footer.html');

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Bootstrap modal instance
  estimateModal = new bootstrap.Modal(document.getElementById('estimateModal'));

  // Open modal from button or card
  document.getElementById('openEstimateBtn').addEventListener('click', function(e) {
    e.preventDefault();
    showEstimateOptions();
    estimateModal.show();
  });
  document.querySelectorAll('.estimate-card').forEach(card => {
    card.addEventListener('click', function() {
      showEstimateOptions();
      estimateModal.show();
      showEstimateForm(this.dataset.type);
    });
  });

  // Option selection in modal
  document.querySelectorAll('.estimate-option').forEach(btn => {
    btn.addEventListener('click', function() {
      showEstimateForm(this.dataset.type);
    });
  });
});

function showEstimateOptions() {
  document.getElementById('estimateOptions').classList.remove('d-none');
  document.getElementById('estimateFormContainer').classList.add('d-none');
  document.getElementById('estimateModalTitle').textContent = 'Get an Estimate';
  document.getElementById('estimateModalDesc').textContent = 'Please fill in the details, so that we can provide you with our best service';
}

function showEstimateForm(type) {
  const formContainer = document.getElementById('estimateFormContainer');
  let title = type === 'truck' ? 'Car' : 'Two Wheeler';
  document.getElementById('estimateModalTitle').textContent = title;
  document.getElementById('estimateModalDesc').textContent = 'Please fill in the details, so we can provide you with the best of our services';
  document.getElementById('estimateOptions').classList.add('d-none');
  formContainer.classList.remove('d-none');
  formContainer.innerHTML = `
    <div class="d-flex justify-content-between align-items-center mb-3">
      <div class="fw-bold">${title}</div>
      <a href="#" class="text-primary small" id="estimateBack">change</a>
    </div>
    <form id="estimateForm">
      <div class="mb-3 input-group">
        <span class="input-group-text bg-white border-0 pe-1"><i class="fa fa-circle" style="color:#198754;"></i></span>
        <input type="text" class="form-control" placeholder="Enter Pickup Location" required>
      </div>
      <div class="mb-3 input-group">
        <span class="input-group-text bg-white border-0 pe-1"><i class="fa fa-map-marker-alt" style="color:#e53935;"></i></span>
        <input type="text" class="form-control" placeholder="Enter Drop Location" required>
      </div>
      <div class="mb-3 input-group">
        <span class="input-group-text bg-white border-0 pe-1"><i class="fa fa-phone-alt" style="color:#495057;"></i></span>
        <input type="tel" class="form-control" placeholder="Enter Mobile" required>
      </div>
      <div class="mb-3 input-group">
        <span class="input-group-text bg-white border-0 pe-1"><i class="fa fa-user" style="color:#495057;"></i></span>
        <input type="text" class="form-control" placeholder="Enter Name" required>
      </div>
      <div class="mb-3 d-flex align-items-center gap-2">
        <label class="mb-0 me-2" style="min-width:120px;">No. of Vehicles</label>
        <button type="button" class="btn btn-outline-primary px-2 py-1" id="decrementBtn">-</button>
        <input type="number" class="form-control text-center" id="vehicleCount" value="1" min="1" max="10" style="width:60px;" readonly>
        <button type="button" class="btn btn-outline-primary px-2 py-1" id="incrementBtn">+</button>
      </div>
      <button type="submit" class="btn btn-primary w-100" disabled id="getFareBtn">Get Fare Estimate</button>
    </form>
  `;
  // Back to options
  document.getElementById('estimateBack').onclick = function(e) {
    e.preventDefault();
    showEstimateOptions();
  };
  // Enable submit if all fields filled
  const form = document.getElementById('estimateForm');
  const inputs = form.querySelectorAll('input[type="text"], input[type="tel"]');
  const getFareBtn = document.getElementById('getFareBtn');
  const vehicleCount = document.getElementById('vehicleCount');
  function validateForm() {
    let allFilled = Array.from(inputs).every(inp => inp.value.trim() !== '');
    let countValid = vehicleCount.value >= 1 && vehicleCount.value <= 10;
    getFareBtn.disabled = !(allFilled && countValid);
  }
  inputs.forEach(input => {
    input.addEventListener('input', validateForm);
  });
  // Counter logic
  document.getElementById('decrementBtn').onclick = function() {
    let val = parseInt(vehicleCount.value);
    if (val > 1) vehicleCount.value = val - 1;
    validateForm();
  };
  document.getElementById('incrementBtn').onclick = function() {
    let val = parseInt(vehicleCount.value);
    if (val < 10) vehicleCount.value = val + 1;
    validateForm();
  };
  // Prevent manual edit
  vehicleCount.onkeydown = function(e) { e.preventDefault(); };
  // Prevent submit (demo)
  form.onsubmit = function(e) {
    e.preventDefault();
    getFareBtn.textContent = `Estimated: ₹${2500 * vehicleCount.value}`;
    getFareBtn.disabled = true;
  };
} 
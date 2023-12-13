function confirmDelete(restaurantId) {
  // Display a confirmation dialog
  const isConfirmed = confirm(
    "Are you sure you want to delete this restaurant?"
  );

  // If the user confirms, proceed with the deletion
  if (isConfirmed) {
    window.location.href = `/api/restaurants/${restaurantId}`;
  }
}

module.exports = {
  confirmDelete,
};

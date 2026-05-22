const API_BASE = "http://localhost:3000";

document.addEventListener("DOMContentLoaded", () => {

  const signupForm = document.querySelector("#signup-form");
  const loginForm = document.querySelector("#login-form");

  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
		e.preventDefault();
		console.log("signup working");

		const formData = new FormData(signupForm);
		const data = Object.fromEntries(formData.entries());

		try {
			const res = await fetch(`${API_BASE}/signup`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(data)
			});

			const result = await res.json();

			if (result.success) {
			window.location.href = "/login.html";
			} else {
			alert(result.message);
			}

		} catch (err) {
			console.error(err);
			alert("Something went wrong");
		}
	});
  }

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
		e.preventDefault();
		console.log("login working");
		const formData = new FormData(loginForm);
		const data = Object.fromEntries(formData.entries());

		const res = await fetch(`${API_BASE}/login`, {
			method: "POST",
			headers: {
			"Content-Type": "application/json"
			},
			body: JSON.stringify(data)
		});

		const result = await res.json();

		if (result.success) {
			window.location.href = "/home.html";
		} else {
			alert(result.message);
		}
    });
  }
});

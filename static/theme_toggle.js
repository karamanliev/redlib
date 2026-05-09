(function() {
	var theme = document.getElementById("theme");
	var auto = document.getElementById("auto-theme-settings");
	if (!theme || !auto) return;
	function toggle() {
		auto.style.display = theme.value === "system" ? "" : "none";
	}
	theme.addEventListener("change", toggle);
	toggle();
})();

function syncCommentThreadToggle(controls, details) {
    const expanded = details.open ? "true" : "false";

    controls.forEach(function(control) {
        control.setAttribute("aria-expanded", expanded);
        control.closest(".comment_left")?.classList.toggle("collapsed", !details.open);
    });
}

function getCommentScrollOffset() {
    const fixedNav = document.querySelector("nav.fixed_navbar");

    if (!fixedNav) {
        return 8;
    }

    return fixedNav.getBoundingClientRect().height + 8;
}

function isVisibleInViewport(element) {
    const rect = element.getBoundingClientRect();
    const topOffset = getCommentScrollOffset();

    return rect.bottom > topOffset && rect.top < window.innerHeight;
}

function scrollCommentIntoView(element) {
    const rect = element.getBoundingClientRect();
    const topOffset = getCommentScrollOffset();
    const targetTop = window.scrollY + rect.top - topOffset;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    window.scrollTo({
        top: Math.max(0, targetTop),
        behavior: prefersReducedMotion ? "auto" : "smooth"
    });
}

document.addEventListener("DOMContentLoaded", function() {
    const commentLeftColumns = document.querySelectorAll(".comment_left");

    commentLeftColumns.forEach(function(commentLeft) {
        const details = commentLeft.nextElementSibling;
        if (!details || !details.classList.contains("comment_right")) {
            return;
        }

        const controls = commentLeft.querySelectorAll(".comment_score, .line");
        const score = commentLeft.querySelector(".comment_score");
        if (!controls.length) {
            return;
        }

        syncCommentThreadToggle(controls, details);
        details.dataset.lastOpen = details.open ? "true" : "false";

        details.addEventListener("toggle", function() {
            const wasOpen = details.dataset.lastOpen === "true";

            syncCommentThreadToggle(controls, details);

            if (wasOpen && !details.open && score && !isVisibleInViewport(score)) {
                scrollCommentIntoView(score);
            }

            details.dataset.lastOpen = details.open ? "true" : "false";
        });

        controls.forEach(function(control) {
            control.addEventListener("click", function() {
                details.open = !details.open;
            });
        });
    });
});

function syncCommentThreadToggle(commentLeft, details) {
    const expanded = details.open ? "true" : "false";
    commentLeft.setAttribute("aria-expanded", expanded);
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

        syncCommentThreadToggle(commentLeft, details);
        details.dataset.lastOpen = details.open ? "true" : "false";

        details.addEventListener("toggle", function() {
            const wasOpen = details.dataset.lastOpen === "true";

            syncCommentThreadToggle(commentLeft, details);

            if (wasOpen && !details.open && !isVisibleInViewport(commentLeft)) {
                scrollCommentIntoView(commentLeft);
            }

            details.dataset.lastOpen = details.open ? "true" : "false";
        });

        commentLeft.addEventListener("click", function() {
            details.open = !details.open;
        });
    });
});

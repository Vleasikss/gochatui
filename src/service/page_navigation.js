export const forward = (page) => {
    window.history.replaceState(null,
        "Chat",
        page
    )
}
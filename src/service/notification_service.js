import {toast} from "react-toastify";



/**
 *
 * @param {string} message
 * @param {play} play sound function taken from useSound hook
 */
export const showInfoMessage = (message, play) => {
    try {
        play()
    } catch (e) {
        console.error(`unable to play: The reason is ${e}`)
    }

    toast.info(message, {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        // icon: "🚀"
        icon: ({theme, type}) =>  <img width={30} height={30} src="https://material-ui.com/static/images/avatar/1.jpg" alt={"not found"}/>
    });
}

export const showDeleteMessage = (message, play) => {
    try {
        play()
    } catch (e) {
        console.error(`unable to play: The reason is ${e}`)
    }
    toast.warn(message, {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        // icon: "🚀"
        icon: ({theme, type}) =>  <img width={30} height={30} src="https://material-ui.com/static/images/avatar/1.jpg" alt={"not found"}/>
    });
}
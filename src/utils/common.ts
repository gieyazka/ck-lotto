import Swal from "sweetalert2";
import { alertType } from "./type"

const callToast = ({ title, type }: alertType) => {
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })

    Toast.fire({
        icon: type,
        title: title
    })
}
const callSweetAlert = ({ title, type }: alertType) => {

    Swal.fire({
        position: 'center',
        icon: type,
        title: title,
        showConfirmButton: false,
        timer: 1500
    })

}

export {
    callToast,callSweetAlert
}
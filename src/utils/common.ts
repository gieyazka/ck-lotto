import Swal from "sweetalert2";
import { alertType } from "./type"
import _ from 'lodash'
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

const compareArraysById = (array1: any, array2: any) => {
    const compareData = _.differenceBy([...array1, ...array2], '$id');
    const uniqueArray = _.uniqBy(compareData, '$id');
    return uniqueArray;
}
export {
    callToast, callSweetAlert, compareArraysById
}
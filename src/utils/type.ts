import { SweetAlertIcon } from "sweetalert2";

type adsData = {
    title: string;
    detail: string;
    date?: string;
    image: File | string | undefined;
    photo: string;
    startDate: Date | undefined;
    endDate: Date | undefined;
};
type lottory_history = {
    date: string;
    lottery_number: string;
};


type loadingStore = {
    isLoad: boolean;
    setLoad: (loading: boolean) => void;
}

type alertType = {
    type: SweetAlertIcon, title: string
}


export type {
    adsData, loadingStore, alertType,lottory_history
}
import { SweetAlertIcon } from "sweetalert2";

type userData = {
    firstname: string,
    lastname: string
}
type feedbackData = {
    rate: string;
    comment: string;
    date?: Date;
    endDate: Date | undefined;
    $id?: string
    users: userData
};
type adsData = {
    title: string;
    detail: string;
    date?: Date;
    image: File[] | string[] | undefined;
    photo: string[] | undefined;
    startDate: Date | undefined;
    endDate: Date | undefined;
    $id?: string
};
type newsData = {
    title: string;
    detail: string;
    date?: Date;
    image: File[] | string[] | undefined;
    photo: string[] | undefined;
    startDate: Date | undefined;
    endDate: Date | undefined;
    $id?: string
};
type lottory_history = {
    date: Date;
    lottery_number: string;
};
type logsData = {
    timestamp?: Date;
    users: userData;
    logData?: string
    docId?: string
    collection?: string;
    type: string
    varible?: string
};


type loadingStore = {
    isLoad: boolean;
    setLoad: (loading: boolean) => void;
}

type alertType = {
    type: SweetAlertIcon, title: string
}


export type {
    adsData, loadingStore, alertType, lottory_history, newsData, feedbackData, userData, logsData
}
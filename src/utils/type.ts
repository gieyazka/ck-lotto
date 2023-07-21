import { SweetAlertIcon } from "sweetalert2";

type winPrice = {
    $id: string;
    digit: string;
    multiply: number[];
    updateDate: Date[]
    users?: string[]
}
type quota = {
    $id: string;
    digit: string;
    quota: number[];
    updateDate: Date[]
    users?: string[]
}

type userData = {
    $id: string | undefined;
    username: string,
    password: string
    firstname: string,
    image: File | undefined
    lastname: string,
    email: string,
    address: string,
    tel: string,
    $createdAt?: string,
    status: string,
    role: string,
    gender: string,
    type: string,
    avatar: string | null | undefined,

}
type groupData = {
    $id: string,
    name: string,
    users: userData[],
    isDelete: boolean,
}
type lotteryDate = {
    date: Date,
    isDelete: boolean
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

type promotionData = {
    $id: string
    name: string
    startDate: Date;
    expireDate: Date;
    bonus: number;
    groups: groupData[]
    users: userData
}
type InvoiceKey = `${string}_invoice`;
type transaction = {
    $id: string,
    $createdAt: Date,
    $collectionId: string,
    lottery: string;
    paymentMethod: string,
    bankName: string
    lotteryType: number;
    amount: number;
    users: userData
    InvoiceKey: any;
    status: string
    transaction_id: string;
    calBy: string;
    transferBy: string;
    transferAmount: number;
}

type composate = {
    digit: string;
    multiply: number[]
}

type pointData = {
    $id: string
    name: string
    startDate: Date;
    expireDate: Date;
    point: number;
}


type loadingStore = {
    isLoad: boolean;
    setLoad: (loading: boolean) => void;
}

type alertType = {
    type: SweetAlertIcon, title: string
}


export type {
    transaction, composate, quota,
    adsData, loadingStore, alertType, lottory_history, newsData, feedbackData, userData, logsData, winPrice, lotteryDate, groupData, promotionData,
    pointData
}
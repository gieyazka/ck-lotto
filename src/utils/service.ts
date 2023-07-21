import { Account, Client, Databases, Query, Storage } from "appwrite";
import { adsData, composate, logsData, lottory_history, quota, transaction, userData, winPrice } from "../utils/type";
import { callToast, compareArraysById } from "./common";
import dayjs, { Dayjs } from 'dayjs';
import { useMutation, useQueryClient } from 'react-query';

import _ from "lodash";
import axios from "axios";
import { t } from "i18next";

/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore










const env = import.meta.env
const client = new Client();
const databases = new Databases(client);
const storage = new Storage(client);
const account = new Account(client);
client
    .setEndpoint('https://ck.moevedigital.com/v1')
    .setProject('CKLOTTO88');

const addUserLog = async (data: logsData) => {
    try {
        const logData = _.cloneDeep(data);
        const promise = await databases.createDocument(env.VITE_DB, "logs", 'unique()',
            logData
        );
        return promise
    } catch (error: any) {
        throw new Error(error.message)
    }
}





const getLottery_history = async (props: { pageIndex: number, pageSize: number }) => {
    const promise = await databases.listDocuments('lotto', 'lotto_history', [
        Query.equal('isDelete', false),
        Query.orderDesc("date"),
        Query.limit(props.pageSize),
        Query.offset((props.pageIndex) * props.pageSize)

    ]);

    return promise
}
const deleteLottery_history = async (docId: string) => {
    const promise = await databases.updateDocument('lotto', 'lotto_history', docId, {
        isDelete: true,
    });
    return promise
}
const addLottery_history = async (data: lottory_history) => {
    try {
        const historyData = _.cloneDeep(data);
        const promise = await databases.createDocument(env.VITE_DB, "lotto_history", 'unique()',
            historyData
        );
        return promise
    } catch (error: any) {
        throw new Error(error.message)
    }
}

const appWriteAuth = async ({ email, password }: { email: string, password: string }) => {
    const res = await account.createEmailSession(
        email,
        password
    );
    return res
}
const logout = async () => {
    account.deleteSessions();
    sessionStorage.removeItem('User')
}
const removeAppwriteSession = async () => {
    // console.log(account);
    const promise = account.get();
    promise.then(function (response: any) {
        console.log(response);
        account.deleteSessions();
    }, function (error: Error) {
        console.log(error);
    });
}
const getUser = async (username: string) => {
    const res = await databases.listDocuments(
        'lotto',
        'users',
        [
            Query.equal('username', username),
        ]
    );
    return res.documents
}
const getUserByEmail = async (email: string) => {

    const res = await databases.listDocuments(
        'lotto',
        'users',
        [
            Query.equal("email", [email]),
        ]
    );
    return res.documents
}
const getUserBytel = async (tel: string) => {

    const res = await databases.listDocuments(
        'lotto',
        'users',
        [
            Query.equal("tel", [tel]),
        ]
    );
    return res.documents
}
const getAds = async (props: { pageIndex: number, pageSize: number }) => {
    const promise = await databases.listDocuments('lotto', 'ads',
        [
            Query.equal('isDelete', false),
            Query.orderDesc("startDate"),
            Query.limit(props.pageSize),
            Query.offset((props.pageIndex) * props.pageSize)
        ]);

    return promise
}
const deleteAds = async (docId: string) => {
    const promise = databases.updateDocument('lotto', 'ads', docId, {
        isDelete: true,
    });
    return promise
}
const addAds = async (data: adsData) => {
    try {
        const resAddFile = await addFile(data.image)
        const adsData = _.cloneDeep(data);
        adsData.photo = resAddFile;
        const { title, detail, photo, startDate, endDate
        } = adsData;
        const promise = await databases.createDocument(env.VITE_DB, "ads", 'unique()', {
            title, detail, image: photo, startDate, endDate,
            date: new Date()
        });
        return promise
    } catch (error: any) {
        throw new Error(error.message)
    }
}


const getFeedback = async (pagination: { pageIndex: number, pageSize: number }, search: string) => {
    if (search !== "") {
        const searchFirstName = await databases.listDocuments('lotto', 'users',
            [
                // Query.equal('isDelete', false),

                Query.search("firstname", search),
                // Query.orderDesc("startDate"),
                Query.limit(pagination.pageSize),
                Query.offset((pagination.pageIndex) * pagination.pageSize)
            ]);
        const searchLastName = await databases.listDocuments('lotto', 'users',
            [
                // Query.equal('isDelete', false),

                Query.search("lastname", search),
                Query.limit(pagination.pageSize),
                Query.offset((pagination.pageIndex) * pagination.pageSize)
            ]);
        console.log('searchFirstName.documents', searchFirstName.documents)
        console.log('searchLastName.documents', searchLastName.documents)
        const firstNameArr = _.flatMap(searchFirstName.documents, (parent) =>
            parent.feedback.map((feedback: any) => ({ ...feedback, users: parent }))
        );
        const lastNameArr = _.flatMap(searchLastName.documents, (parent) =>
            parent.feedback.map((feedback: any) => ({ ...feedback, users: parent }))
        );

        // console.log('newArray', newArray)
        const compareData = compareArraysById(firstNameArr, lastNameArr)
        console.log('compareData', compareData)
        return {
            total: compareData.length,
            documents: compareData

        }
    }
    const promise = await databases.listDocuments('lotto', 'feedback',
        [
            Query.equal('isDelete', false),
            Query.orderDesc("date"),
            Query.limit(pagination.pageSize),
            Query.offset((pagination.pageIndex) * pagination.pageSize)
        ]);

    return promise
}
const transferMoney = async (data: transaction, composate: composate[]) => {
    console.log('data', data.lotteryType)

    const checkMultiply = composate.find(d => parseInt(d.digit) === data.lotteryType)
    if (checkMultiply === undefined) {
        throw new Error(`No Compostate ${data.lotteryType} digit`)
    }


    const promise = databases.updateDocument('lotto', data.$collectionId, data.$id, {
        // isDelete: true,
        status: "transfered",
        transferAmount: _.last(checkMultiply.multiply)! * data.amount
    });
    return promise
}

const deleteFeedback = async (docId: string) => {
    const promise = databases.updateDocument('lotto', 'feedback', docId, {
        isDelete: true,
    });
    return promise
}



const upDateQuota = async (data: quota) => {
    try {
        const quotaData = _.cloneDeep(data);
        // console.log('winPriceData', winPriceData)
        if (quotaData.$id) {
            //Update
            const promise = databases.updateDocument('lotto', 'quotas', data.$id, {

                multiply: data.quota,
                updateDate: data.updateDate,
                users: data.users
            });
            return promise
        } else {
            //Add    
            const promise = await databases.createDocument(env.VITE_DB, "quotas", 'unique()',
                quotaData
            );
            return promise
        }
    } catch (error: any) {
        throw new Error(error.message)
    }
}
const upDateWinPrice = async (data: winPrice) => {
    try {
        const winPriceData = _.cloneDeep(data);
        // console.log('winPriceData', winPriceData)
        if (winPriceData.$id) {
            //Update
            const promise = databases.updateDocument('lotto', 'composateAmount', data.$id, {

                multiply: data.multiply,
                updateDate: data.updateDate,
                users: data.users
            });
            return promise
        } else {
            //Add    
            const promise = await databases.createDocument(env.VITE_DB, "composateAmount", 'unique()',
                winPriceData
            );
            return promise
        }
    } catch (error: any) {
        throw new Error(error.message)
    }
}


const upDatelotteryDate = async (dateClick: Date, lotteryDate: any) => {
    try {
        if (lotteryDate) {
            //Update
            const promise = databases.updateDocument('lotto', 'lottery_date', lotteryDate.$id, {

                isDelete: !lotteryDate.isDelete
            });
            return promise
        } else {
            //Add    
            const promise = await databases.createDocument(env.VITE_DB, "lottery_date", 'unique()',
                { date: dateClick }
            );
            return promise
        }
    } catch (error: any) {
        throw new Error(error.message)
    }
}




const getWinPrice = async (props: { pageIndex: number, pageSize: number }) => {
    const promise = await databases.listDocuments('lotto', 'composateAmount',
        [

            Query.limit(props.pageSize),
            Query.offset((props.pageIndex) * props.pageSize)
        ]);
    return promise
}
const getQuota = async (props: { pageIndex: number, pageSize: number }) => {
    const promise = await databases.listDocuments('lotto', 'quotas',
        [

            Query.limit(props.pageSize),
            Query.offset((props.pageIndex) * props.pageSize)
        ]);
    return promise
}
const getAllWinPrice = async () => {
    const promise = await databases.listDocuments('lotto', 'composateAmount',
    );
    return promise
}
const getLotteryDate = async (month: Dayjs) => {
    const startDate = dayjs(month).startOf("year").toISOString()
    const endDate = dayjs(month).add(1, 'year').toISOString()
    const promise = await databases.listDocuments('lotto', 'lottery_date',
        [

            Query.greaterThan("date", startDate),
            Query.lessThanEqual("date", endDate),
            Query.limit(500),

        ]);
    return promise
}
const getLotteryDateTwoYear = async () => {

    const startDate = dayjs().startOf("month").subtract(2, 'year').toISOString()
    const promise = await databases.listDocuments('lotto', 'lottery_date',
        [
            Query.equal("isDelete", false),
            Query.greaterThan("date", startDate),
            Query.limit(50000),

        ]);
    return promise
}
const gettransactions = async (date: Date | undefined) => {
    const dayJSDAte = dayjs(date)
    console.log('dayJSDAte', dayJSDAte.format("YYYYMMDD"))
    const promise = await databases.listDocuments('lotto', dayJSDAte.format("YYYYMMDD"),
        [
            // Query.equal("isDelete", false),
            // Query.greaterThan("date", dayJSDAte.toISOString()),
            Query.limit(50000000),

        ]);
    return promise
}
const getNews = async (props: { pageIndex: number, pageSize: number }) => {
    const promise = await databases.listDocuments('lotto', 'news',
        [
            Query.equal('isDelete', false),
            Query.orderDesc("startDate"),
            Query.limit(props.pageSize),
            Query.offset((props.pageIndex) * props.pageSize)
        ]);
    return promise
}
const deleteNews = async (docId: string) => {
    const promise = databases.updateDocument('lotto', 'news', docId, {
        isDelete: true,
    });
    return promise
}
const addNews = async (data: adsData) => {
    try {
        const resAddFile = await addFile(data.image)
        const adsData = _.cloneDeep(data);
        adsData.photo = resAddFile;
        const { title, detail, photo, startDate, endDate
        } = adsData;
        const promise = await databases.createDocument(env.VITE_DB, "news", 'unique()', {
            title, detail, image: photo, startDate, endDate,
            date: new Date()
        });
        return promise
    } catch (error: any) {
        throw new Error(error.message)
    }
}
const addFile = async (file: File[] | string[] | undefined) => {
    if (file === undefined) {
        return
    }
    // const promise = storage.createFile('6491ce1131561710ddb5', "test123", file);
    const imgArr = []
    for (let index = 0; index < file.length; index++) {
        const element = file[index];
        const promise = storage.createFile(env.VITE_imageBucket, "unique()", element);
        const res = await promise.then(function (response: any) {
            // console.log(response); // Success
            const url = env.VITE_server + "/storage/buckets/" + env.VITE_imageBucket + "/files/" + response['$id'] + "/view?project=CKLOTTO88"
            response.url = url
            response.status = 200
            return response
        }, function (error: any) {
            error.status = 405
            return error
        });
        if (res.status === 200) {
            imgArr.push(JSON.stringify({
                url: res.url,
                name: res.name,
            }))

        }
    }
    return imgArr
}


const getUserGroup = async (pagination: { pageIndex: number, pageSize: number }, textSearch: string) => {
    if (textSearch !== "") {
        const searchUsername = await databases.listDocuments('lotto', 'groups',
            [
                Query.equal('isDelete', false),
                Query.search("name", textSearch),
                // Query.orderDesc("startDate"),
                Query.limit(pagination.pageSize),
                Query.offset((pagination.pageIndex) * pagination.pageSize)
            ]);
        return searchUsername
    } else {

        const promise = await databases.listDocuments('lotto', 'groups',
            [
                Query.equal('isDelete', false),
                // Query.orderDesc("startDate"),
                Query.limit(pagination.pageSize),
                Query.offset((pagination.pageIndex) * pagination.pageSize)
            ]);

        return promise
    }

}


const getPoints = async (pagination: { pageIndex: number, pageSize: number }, textSearch: string) => {
    if (textSearch !== "") {
        const searchUsername = await databases.listDocuments('lotto', 'points',
            [
                Query.equal('isDelete', false),
                Query.search("name", textSearch),
                // Query.orderDesc("startDate"),
                Query.limit(pagination.pageSize),
                Query.offset((pagination.pageIndex) * pagination.pageSize)
            ]);
        return searchUsername
    } else {

        const promise = await databases.listDocuments('lotto', 'points',
            [
                Query.equal('isDelete', false),
                // Query.orderDesc("startDate"),
                Query.limit(pagination.pageSize),
                Query.offset((pagination.pageIndex) * pagination.pageSize)
            ]);

        return promise
    }

}

const getPromotions = async (pagination: { pageIndex: number, pageSize: number }, textSearch: string) => {
    if (textSearch !== "") {
        const searchUsername = await databases.listDocuments('lotto', 'promotions',
            [
                Query.equal('isDelete', false),
                Query.search("name", textSearch),
                // Query.orderDesc("startDate"),
                Query.limit(pagination.pageSize),
                Query.offset((pagination.pageIndex) * pagination.pageSize)
            ]);
        return searchUsername
    } else {

        const promise = await databases.listDocuments('lotto', 'promotions',
            [
                Query.equal('isDelete', false),
                // Query.orderDesc("startDate"),
                Query.limit(pagination.pageSize),
                Query.offset((pagination.pageIndex) * pagination.pageSize)
            ]);

        return promise
    }

}
const getAllGroup = async () => {


    const promise = await databases.listDocuments('lotto', 'groups',
        [
            Query.equal('isDelete', false),
            // Query.orderDesc("startDate"),
            Query.limit(5000000),
        ]);

    return promise


}
const getCustomer = async (pagination: { pageIndex: number, pageSize: number }, textSearch: string) => {
    if (textSearch !== "") {
        const searchUsername = await databases.listDocuments('lotto', 'users',
            [
                Query.equal('isDelete', false),
                Query.equal('type', "customer"),
                Query.search("username", textSearch),
                // Query.orderDesc("startDate"),
                Query.limit(pagination.pageSize),
                Query.offset((pagination.pageIndex) * pagination.pageSize)
            ]);
        const searchEmail = await databases.listDocuments('lotto', 'users',
            [
                Query.equal('isDelete', false),
                Query.equal('type', "customer"),
                Query.search("email", textSearch),
                Query.limit(pagination.pageSize),
                Query.offset((pagination.pageIndex) * pagination.pageSize)
            ]);

        const compareData = compareArraysById(searchUsername.documents, searchEmail.documents)
        return {
            total: compareData.length,
            documents: compareData

        }
    } else {

        const promise = await databases.listDocuments('lotto', 'users',
            [
                Query.equal('isDelete', false),
                Query.equal('type', "customer"),
                // Query.orderDesc("startDate"),
                Query.limit(pagination.pageSize),
                Query.offset((pagination.pageIndex) * pagination.pageSize)
            ]);

        return promise
    }

}
const deleteUser = async (docId: string) => {
    const promise = await databases.updateDocument('lotto', 'users', docId, {
        isDelete: true,
    });
    return promise
}


const createUser = async (data: userData) => {
    const send_formData = new FormData();
    send_formData.append("data", JSON.stringify({ ...data, type: 'employee' }));

    if (data.image) {

        send_formData.append(`files`, data.image);
    }


    const res = await axios({
        method: "post",
        url: `${env.VITE_backend}/addUser/`,
        data: send_formData,
        headers: { "Content-Type": "multipart/form-data" },
        validateStatus: function (status) {
            return status < 500; // Resolve only if the status code is less than 500
        }
    });
    if (res.status >= 300) {
        throw new Error(res.data.message)
    }
    return res.data
    // const promise = await account.create('unique()', data.email, data.password, data.firstname + " " + data.lastname);
    // console.log('promise', promise)
    // const updatePhone = await account.updatePhone(data.tel, data.password);
    // console.log('updatePhone',updatePhone )
}


const updateUser = async (data: userData, docId: string) => {
    try {
        const adsData = _.cloneDeep(data);
        if (data.image) {

            const resAddFile = await addFile([data.image])
            if (resAddFile) {

                adsData.avatar = resAddFile[0];
            }
        }
        const { firstname, lastname, address, tel, avatar, gender
        } = adsData;
        const promise = await databases.updateDocument(env.VITE_DB, "users", docId, {
            firstname, lastname, avatar, address, tel, gender
        });

        return promise
    } catch (error: any) {
        throw new Error(error.message)
    }
}




const getEmployee = async (pagination: { pageIndex: number, pageSize: number }, empSearch: string) => {
    if (empSearch !== "") {
        const searchUsername = await databases.listDocuments('lotto', 'users',
            [
                Query.equal('isDelete', false),
                Query.equal('type', "employee"),
                Query.search("username", empSearch),
                // Query.orderDesc("startDate"),
                Query.limit(pagination.pageSize),
                Query.offset((pagination.pageIndex) * pagination.pageSize)
            ]);
        const searchEmail = await databases.listDocuments('lotto', 'users',
            [
                Query.equal('isDelete', false),
                Query.equal('type', "employee"),
                Query.search("email", empSearch),
                // Query.orderDesc("startDate"),
                Query.limit(pagination.pageSize),
                Query.offset((pagination.pageIndex) * pagination.pageSize)
            ]);
        const compareData = compareArraysById(searchUsername.documents, searchEmail.documents)

        return {
            total: compareData.length,
            documents: compareData

        }

        // return promise


    }
    else {

        const promise = await databases.listDocuments('lotto', 'users',
            [
                Query.equal('isDelete', false),
                Query.equal('type', "employee"),
                // Query.orderDesc("startDate"),
                Query.limit(pagination.pageSize),
                Query.offset((pagination.pageIndex) * pagination.pageSize)
            ]);

        return promise
    }
}

const getUserSession = () => {
    const user = JSON.parse(sessionStorage.getItem("User") || "null");
    return user
}


const addPromotions = async (data: any) => {
    try {

        const promise = await databases.createDocument(env.VITE_DB, "promotions", 'unique()',
            { name: data.name, startDate: data.startDate, expireDate: data.expireDate, users: data.users, bonus: parseFloat(data.bonus), groups: data.groups }
        );
        return promise
    } catch (error: any) {
        throw new Error(error.message)
    }
}
const deletePromotions = async (docId: string) => {
    try {

        const promise = databases.updateDocument('lotto', 'promotions', docId,

            { isDelete: true }
        );
        return promise



    } catch (error: any) {
        throw new Error(error.message)
    }
}
const updatePromotions = async (data: any, docId: string) => {
    try {

        const promise = databases.updateDocument('lotto', 'promotions', docId,

            { name: data.name, startDate: data.startDate, expireDate: data.expireDate, users: data.users, bonus: parseFloat(data.bonus), groups: data.groups }

        );
        return promise



    } catch (error: any) {
        throw new Error(error.message)
    }
}


const addPoints = async (data: any) => {
    try {

        const promise = await databases.createDocument(env.VITE_DB, "points", 'unique()',
            {
                name: data.name, startDate: data.startDate, expireDate: data.expireDate, point: parseFloat(data.point)
                // , groups: data.groups
            }
        );
        return promise
    } catch (error: any) {
        throw new Error(error.message)
    }
}
const deletePoints = async (docId: string) => {
    try {

        const promise = databases.updateDocument('lotto', 'points', docId,

            { isDelete: true }
        );
        return promise



    } catch (error: any) {
        throw new Error(error.message)
    }
}
const updatePoints = async (data: any, docId: string) => {
    try {

        const promise = databases.updateDocument('lotto', 'points', docId,

            {
                name: data.name, startDate: data.startDate, expireDate: data.expireDate, point: parseFloat(data.point)
                // , groups: data.groups
            }

        );
        return promise



    } catch (error: any) {
        throw new Error(error.message)
    }
}

const calculateWin = async (date: Date | undefined, userId: string) => {
    const res = await axios({
        method: "post",
        url: `${env.VITE_backend}/calWin/`,
        data: { date, userId },
        // headers: { "Content-Type": "multipart/form-data" },
        validateStatus: function (status) {
            return status < 500; // Resolve only if the status code is less than 500
        }
    });
    return res
}

export {
    calculateWin, transferMoney, getAllWinPrice, getQuota, upDateQuota,
    addPoints, deletePoints, updatePoints, addPromotions, updatePromotions, deletePromotions, addFile, addAds, deleteAds, getAds, getUser, appWriteAuth, logout, removeAppwriteSession, getLottery_history, addLottery_history, deleteLottery_history, getWinPrice, upDateWinPrice, upDatelotteryDate, getAllGroup, getPromotions, getPoints,
    getNews, addNews, deleteNews, getFeedback, deleteFeedback, addUserLog, getCustomer, getEmployee, createUser, deleteUser, updateUser, getUserSession, getUserByEmail, getUserBytel, getLotteryDate, getLotteryDateTwoYear, getUserGroup, gettransactions
}

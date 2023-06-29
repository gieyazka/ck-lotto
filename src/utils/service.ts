/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore

import { Account, Client, Databases, Query, Storage } from "appwrite";
import { adsData, logsData, lottory_history } from "../utils/type";
import { useMutation, useQueryClient } from 'react-query';

import _ from "lodash";

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


const getFeedback = async (props: { pageIndex: number, pageSize: number }) => {
    const promise = await databases.listDocuments('lotto', 'feedback',
        [
            Query.equal('isDelete', false),
            Query.orderDesc("date"),
            Query.limit(props.pageSize),
            Query.offset((props.pageIndex) * props.pageSize)
        ]);

    return promise
}
const deleteFeedback = async (docId: string) => {
    const promise = databases.updateDocument('lotto', 'feedback', docId, {
        isDelete: true,
    });
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
    console.log(file);
    if (file === undefined) {
        return
    }
    // const promise = storage.createFile('6491ce1131561710ddb5', "test123", file);
    const imgArr = []
    for (let index = 0; index < file.length; index++) {
        const element = file[index];
        const promise = storage.createFile(env.VITE_imageBucket, "unique()", element);
        const res = await promise.then(function (response) {
            // console.log(response); // Success
            const url = env.VITE_server + "/storage/buckets/" + env.VITE_imageBucket + "/files/" + response['$id'] + "/view?project=CKLOTTO88"
            response.url = url
            response.status = 200
            return response
        }, function (error) {
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

export {
    addFile, addAds, deleteAds, getAds, getUser, appWriteAuth, logout, removeAppwriteSession, getLottery_history, addLottery_history, deleteLottery_history,
    getNews, addNews, deleteNews, getFeedback, deleteFeedback, addUserLog
}

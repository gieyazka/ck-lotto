import { Account, Client, Databases, Query, Storage } from "appwrite";
import { adsData, lottory_history } from "../utils/type";
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





    
const getAds = async () => {
    const promise = await databases.listDocuments('lotto', 'ads');

    return promise
}
const getLottery_history = async () => {
    const promise = await databases.listDocuments('lotto', 'lotto_history', [
        Query.equal('isDelete', false)

    ]);

    return promise
}
const deleteLottery_history = async (docId: string) => {
    const promise = databases.updateDocument('lotto', 'lotto_history', docId, {
        isDelete: true,
    });



    return promise
}
const addLottery_history = async (data: lottory_history) => {

    try {

        const historyData = _.cloneDeep(data);
        console.log(historyData);
        /* Destructuring the `historyData` object and assigning the values of its properties `date` and
        `lottery_number` to the variables `date` and `lottery_number`, respectively. */
        // const {date, lottery_number } = historyData;
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

const addAds = async (data: adsData) => {

    try {


        const resAddFile = await addFile(data.image)
        if (resAddFile.status === 200) {
            const adsData = _.cloneDeep(data);
            adsData.photo = JSON.stringify({
                url: resAddFile.url,
                name: resAddFile.name,
            });
            const { title, detail, photo, startDate, endDate
            } = adsData;
            const promise = await databases.createDocument(env.VITE_DB, "ads", 'unique()', {
                title, detail, image: photo, startDate, endDate,
                date: new Date()
            });
            return promise

        } else {
            throw new Error("Cannot Insert Image")
        }
    } catch (error: Error) {
        throw new Error(error.message)

    }

}


const addFile = async (file: File | undefined) => {
    console.log(file);
    if (file === undefined) {
        return
    }
    const promise = storage.createFile(env.VITE_imageBucket, "unique()", file);
    // const promise = storage.createFile('6491ce1131561710ddb5', "test123", file);

    const res = await promise.then(function (response) {
        // console.log(response); // Success
        const url = env.VITE_server + "/storage/buckets/" + env.VITE_imageBucket + "/files/" + response['$id'] + "/view?project=CKLOTTO88"
        response.url = url
        response.status = 200
        return response
    }, function (error) {
        console.log(error);
        error.status = 405
        return error
    });

    return res
}

export { addFile, addAds, getAds, getUser, appWriteAuth, logout, removeAppwriteSession, getLottery_history, addLottery_history, deleteLottery_history }

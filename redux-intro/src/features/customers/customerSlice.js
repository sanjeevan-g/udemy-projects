const initialStateCustomer = {
    fullName: "",
    nationalID: "",
    createdAt: null
}



export default function customerReducer(state = initialStateCustomer, action) {
    switch (action.type) {
        case "customer/createCustomer": {
            return {
                ...state,
                fullName: action.payload.fullName,
                nationalID: action.payload.nationalID,
                createdAt: action.payload.createdAt
            }
        }
        case "customer/updateName": {
            return {
                ...state,
                fullName: action.payload
            }
        }
        default: {
            return state
        }
    }
}

export function createCustomer(fullName, nationalID) {
    return {
        type: "customer/createCustomer",
        payload: {
            fullName,
            nationalID,
            createdAt: new Date().toISOString() // it is a sideeffect, so it has to be in action creator function
        }
    }
}
export function updateName(fullname) {
    return {
        type: "customer/updateName",
        payload: fullname
    }
}
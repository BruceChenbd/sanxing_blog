export async function errorCaptured(asyncFunc,arg) {
    try {
        let res = await asyncFunc(arg)
        return [null, res]
    } catch (e) {
        return [e, null]
    }
}
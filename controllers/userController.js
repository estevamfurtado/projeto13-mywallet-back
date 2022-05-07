import mywalletDb from '../mywalletDb.js';


export async function getUser(req, res) {
    const { user } = res.locals;
    res.send(user);
}
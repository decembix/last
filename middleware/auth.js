const jwt = require('jsonwebtoken');
require('dotenv').config();
const secret = process.env.JWT_SECRET || 'dhkwlsWKqorhvmek'; // 환경 변수를 사용

module.exports = function (req, res, next) {
    const token = req.header('x-auth-token');//전역 변수가 되면 안됨.값이 덮어씌워질수도 있음.

    if (!token) {
        return res.status(401).json({ msg: '회원정보오류' });//token이 없는 경우
    }

    try {
        const decoded = jwt.verify(token, secret);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: '회원정보가 유효하지 않습니다' });//유효하지 않은 token을 들고옴
    }
};

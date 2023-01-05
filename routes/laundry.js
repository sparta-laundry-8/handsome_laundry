const { application } = require("express");
const express = require("express");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const {Customer, Supplier, Laundry } = require("../models")
// customer 인증 미들웨어
const jwtCustomer = require("../middlewares/jwt-customer.js");
// supplier 인증 미들웨어
const jwtSupplier = require("../middlewares/jwt-supplier.js");

const router = express.Router();

// 고객용 세탁 서비스 신청 페이지
router.post('/laundry/apply', jwtCustomer, async(req, res) => {
    try{
        const customer = res.locals.customer;
        const customerId = customer.customerId;

        const {photoURL, request, cellPhone, address} = req.body;

        const confirmForm = await Laundry.findAll({
            where: {
              [Op.or]: [{ photoURL }, { request }, {cellPhone}, {address}],
            },
          }); 
        if (!confirmForm) {
            return res.status(400).json({Message : "모든 항목을 작성해 주세요."})
        }
        return await Laundry.create({customerId, photoURL, request, cellPhone, address}),
        res.status(200).json({Message : "세탁물 신청이 접수되었습니다."});

    } catch(error) {
        console.error(error),
        res.status(500).json({errorMessage: error.Message});
      };
});

// customer : 신청한 세탁 서비스 상태 파악 페이지
router.get('/laundry/apply/:customerId', jwtCustomer, async (req, res) => {
    try{
        const customer = res.locals.customer;
        const customerId = customer.customerId;

        const currentLaundry = await Laundry.findAll({customerId});
        res.status(200).json({currentLaundry});

    } catch(error) {
        console.error(error),
        res.status(500).json({errorMessage: error.Message});
      };
});

// supplier : 고객이 신청한 세탁물 서비스 목록
router.get('/laundry/list', jwtSupplier,  async(req, res) => {
    try{
        const laundrys = await Laundry.findAll({
        });
        if (!laundrys) {
            return res.status(200).json({Message: "현재 대기중인 세탁물이 없습니다."});
        };
        return res.status(200).json({laundrys})
    } catch(error) {
        console.error(error),
        res.status(500).json({errorMessage: error.Message})
      }
});

// supplier : 고객이 신청한 세탁물 서비스 상세 조회
router.get('/laundry/list/:laundryId', jwtSupplier, async (req, res) => {
    try{
        const {laundryId} = req.params;

        const laundryDetail = await Laundry.findOne({
            where: {laundryId}
        })
        if (!laundryDetail) {
            return res.status(400).json({Message: "존재하지 않는 세탁물 입니다."});
        };
        return res.status(200).json({laundryDetail});

    } catch(error) {
        console.error(error),
        res.status(500).json({errorMessage: error.Message});
      };
});

// supplier : 세탁물 수거하기
router.patch('/laundry/list/:laundryId', jwtSupplier, async (req, res) =>{
    try{
        const supplier = res.locals.supplier;
        const supplierId = supplier.supplierId;

        const {laundryId} = req.params;
        const laundryStatus = await Laundry.findOne({where : {laundryId}});
        if (laundryStatus) {
            return await Laundry.update({supplierId, status : 1}, {where : {laundryId}}),
            // await Laundry.increment({status:1}, {where: {laundryId}}),
            res.status(200).json({Message : "수거접수가 완료되었습니다."})
        }

    } catch(error) {
        console.error(error),
        res.status(500).json({errorMessage: error.Message});
      };
})
module.exports = router;
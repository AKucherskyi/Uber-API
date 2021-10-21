
const express = require('express');
const {verifyToken} = require('../controllers/authController');
const controller = require('../controllers/loadController');
const checkDriverRole = require('../middleware/checkDriverRole');
const checkForFreeDrivers = require('../middleware/checkForFreeDrivers');
const checkShipperRole = require('../middleware/checkShipperRole');
const {validateLoad} = require('../middleware/validationService');
const router = express.Router();

router.post(
    '/',
    verifyToken,
    checkShipperRole,
    validateLoad,
    controller.addLoad,
);
router.get('/', verifyToken, controller.getLoads);
router.get('/active', verifyToken, checkDriverRole, controller.getActiveLoad);
router.patch(
    '/active/state',
    verifyToken,
    checkDriverRole,
    controller.iterateLoadState,
);
router.post('/:id/post', verifyToken, checkForFreeDrivers, controller.postLoad);
router.get('/:id', verifyToken, checkShipperRole, controller.getLoad);
router.put('/:id', verifyToken, checkShipperRole, controller.updateLoad);
router.delete('/:id', verifyToken, checkShipperRole, controller.deleteLoad);
router.get(
    '/:id/shipping_info',
    verifyToken,
    checkShipperRole,
    controller.getLoadInfo,
);

module.exports = router;

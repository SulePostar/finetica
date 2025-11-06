const { findAllInvalid, findById } = require('../services/kufProcessingLog');
const { KufProcessingLog } = require('../models');

const getInvalidKufs = async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const data = await findAllInvalid(Number(page), Number(limit));
        res.json(data);
    } catch (err) {
        next(err);
    }
};

const getKufLog = async (req, res, next) => {
    try {
        const log = await findById(Number(req.params.id));
        if (!log) return res.status(404).json({ message: 'KUF log not found' });
        res.json(log);
    } catch (err) {
        next(err);
    }
};

const deleteKufLog = async (req, res, next) => {
  try {
    const { id } = req.params;

    const log = await KufProcessingLog.findByPk(id);

    if (!log) {
      return res.status(404).json({ error: 'KUF log not found' });
    }

    await log.destroy();

    return res.json({ success: true, message: 'KUF log deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getInvalidKufs, getKufLog, deleteKufLog };
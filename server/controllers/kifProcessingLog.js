const { findAllInvalid, findById } = require('../services/kifProcessingLog');
const { KifProcessingLog } = require('../models');

const getInvalidKifs = async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const data = await findAllInvalid(Number(page), Number(limit));
        res.json(data);
    } catch (err) {
        next(err);
    }
};

const getKifLog = async (req, res, next) => {
    try {
        const log = await findById(Number(req.params.id));
        if (!log) return res.status(404).json({ message: 'KIF log not found' });
        res.json(log);
    } catch (err) {
        next(err);
    }
};

const deleteKifLog = async (req, res, next) => {
  try {
    const { id } = req.params;

    const log = await KifProcessingLog.findByPk(id);
    if (!log) {
      return res.status(404).json({ error: 'KIF log not found' });
    }

    await log.destroy();
    return res.json({ success: true, message: 'KIF log deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getInvalidKifs, getKifLog, deleteKifLog };

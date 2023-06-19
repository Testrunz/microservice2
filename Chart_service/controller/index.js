const { Point } = require("@influxdata/influxdb-client");
const User = require("../models/User");
const Chart = require("../models/Chart");
const { influxDb } = require("../config");
const createChart = async (req, res) => {
  try {
    const { client, org, bucket } = await influxDb();
    const chart = new Chart({ ...req.body });
    let temp = await chart.save();
    temp = await User.findOneAndUpdate(
      { userId: req.user.userId },
      { $push: { chartIds: temp._id } },
      { new: true }
    ).lean();
    const writeApi = client.getWriteApi(org, bucket);
    writeApi.useDefaultTags({ host: "host1" });
    const point = new Point("mem").floatField("used_percent", 23.43234543);
    writeApi.writePoint(point);
    writeApi
      .close()
      .then(() => {
        console.log("FINISHED");
      })
      .catch((e) => {
        console.error(e);
        console.log("\\nFinished ERROR");
      });
    return res.status(200).json(temp);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error. Please try again" });
  }
};
const listCharts = async (req, res) => {
  try {
    let temp = await User.findOne({ userId: req.user.userId }).lean();
    temp = temp.chartIds.map((ele) => ele.toString());
    return res.status(200).json(temp);
  } catch (error) {
    return res.status(500).json({ error: "Server error. Please try again" });
  }
};
const readInflux = async (req, res) => {
  try {
    const { client, org, bucket } = await influxDb();

    const queryApi = client.getQueryApi(org);

    const query = `from(bucket: \"${bucket}\") |> range(start: -1h)`;

    queryApi.queryRows(query, {
      next(row, tableMeta) {
        const o = tableMeta.toObject(row);
        console.log(o);
      },
      error(error) {
        console.error(error);
        console.log("\\nFinished ERROR");
      },
      complete() {
        console.log("\\nFinished SUCCESS");
      },
    });

    return res.status(200).json({});
  } catch (error) {
    return res.status(500).json({ error: "Server error. Please try again" });
  }
};
module.exports = {
  createChart,
  listCharts,
  readInflux,
};

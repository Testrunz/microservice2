const mongoose = require("mongoose");
const { Schema } = mongoose;
const SettingSchema = new Schema({
  organizationId: {type: String, unique: true},
  notification: {
    procdure: {
      notification: { type: Boolean, default: true },
      mail: { type: Boolean, default: true },
    },
    tasksubmit: {
      notification: { type: Boolean, default: true },
      mail: { type: Boolean, default: true },
    },
    message: {
      notification: { type: Boolean, default: true },
      mail: { type: Boolean, default: true },
    },
  },
  roleSetting: {
    procedure: {
        admin: {
            create: {type: Boolean, default: true},
            delete: {type: Boolean, default: true},
            edit: {type: Boolean, default: true},
            view: {type: Boolean, default: true},
            assign: {type: Boolean, default: true},
            share: {type: Boolean, default: true}
        },
        requester: {
            create: {type: Boolean, default: true},
            delete: {type: Boolean, default: true},
            edit: {type: Boolean, default: true},
            view: {type: Boolean, default: true},
            assign: {type: Boolean, default: true},
            share: {type: Boolean, default: true}
        },
        tester: {
            create: {type: Boolean, default: true},
            delete: {type: Boolean, default: true},
            edit: {type: Boolean, default: true},
            view: {type: Boolean, default: true},
            assign: {type: Boolean, default: true},
            share: {type: Boolean, default: true}
        },
    },
    profile:{
        admin: {
            edituser: {type: Boolean, default: true},
            changepass: {type: Boolean, default: true},
            editorg: {type: Boolean, default: true},
        },
        requester: {
            edituser: {type: Boolean, default: true},
            changepass: {type: Boolean, default: true},
            editorg: {type: Boolean, default: true},
        },
        tester: {
            edituser: {type: Boolean, default: true},
            changepass: {type: Boolean, default: true},
            editorg: {type: Boolean, default: true},
        },
    }
  },
});

module.exports = Setting = mongoose.model("setting", SettingSchema);
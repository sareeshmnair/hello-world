"use strict";

var app = require("../../server/server");
var Moment = require("moment");
const MomentRange = require('moment-range');
const moment = MomentRange.extendMoment(Moment);

module.exports = function(Bookedslots) {
    Bookedslots.fetchCurrentUserBookedSlots = function(filterItem, cb) {
        let format = 'YYYY-MM-DDTHH:mm:ss.SSS[Z]'

        console.log(filterItem, "filterItem testiinggggggggggggg")

        console.log("filterItem.date", filterItem.date)
        let fromDate = Moment(filterItem.date).startOf('day').toString()
        let toDate = Moment(filterItem.date).endOf('day').toString()
        fromDate = Moment(fromDate).format(format)
        toDate = Moment(toDate).format(format)


        //     let from = moment.tz(filterItem.date, format, 'Asia/Calcutta');
        //     let fromStart = moment.tz(filterItem.date, format, 'Asia/Calcutta').startOf('day').utc()
        //     let end = moment.tz(filterItem.date, format, 'Asia/Calcutta').endOf('day').utc()


        app.models.slots.find({}, (err, allSlots) => {
            let slots = allSlots
            if (allSlots) {
                Bookedslots.find({
                        where: {
                            bookedAt: {
                                "gte": fromDate,
                                "lte": toDate
                            }
                        },
                    },
                    (err, res) => {
                        if (res.length) {
                            allSlots.map((element, i) => {
                                let tempArray = [];
                                tempArray = res.filter(
                                    (_items) => _items.slot === element.slot
                                );


                                if (tempArray.length) {
                                    console.log(slots[i], "+---------------------")

                                    let t = {
                                        slot: slots[i].slot,
                                        id: slots[i].id,
                                        status: true

                                    }

                                    slots[i] = {...t }
                                }
                            });


                            //console.log(allSlots,"[[[[[[[[resresresresresres")
                            cb(null, allSlots);
                        } else {
                            cb(null, allSlots);
                        }
                    }
                );
            }
            // console.log(allSlots, "from all slots+++++++++++++")
        });
    };
    Bookedslots.remoteMethod("fetchCurrentUserBookedSlots", {
        accepts: { arg: "filterItem", type: "object" },
        returns: { arg: "slots", type: "string" },
    });
};
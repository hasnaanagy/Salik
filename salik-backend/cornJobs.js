const cron = require("node-cron");
const Ride = require("./models/Ride");

cron.schedule("0 * * * *", async () => {
    try {
        const now = new Date();
        
        // Find rides where rideDateTime has passed and update status to 'completed'
        const result = await Ride.updateMany(
            { rideDateTime: { $lt: now }, status: "upcoming" },
            { $set: { status: "completed" } }
        );

        console.log(`Updated ${result.modifiedCount} rides to completed`);
    } catch (error) {
        console.error("Error updating past rides:", error);
    }
});

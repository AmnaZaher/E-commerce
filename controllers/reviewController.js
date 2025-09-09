const Order = require("../models/Order");
const User = require("../models/users");
const nodemailer = require("nodemailer");

exports.reviewOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { email, stars, comment } = req.body;

        
        if (!email || !stars || !comment) {
            return res.status(400).json({ message: "All fields are required: email, stars, comment" });
        }
        if (stars < 1 || stars > 5) {
            return res.status(400).json({ message: "Stars must be between 1 and 5" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (order.review) {
            return res.status(400).json({ message: "You already reviewed this order" });
        }

        order.review = { userEmail: email, stars, comment };
        await order.save();

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        let subject = "Thank you for your review!";
        let text = "";

        if (stars < 3) {
            subject = "We're sorry about your experience 😔";
            text = "We sincerely apologize for the inconvenience you faced with your product.";
        } else if (stars === 3) {
            subject = "Thank you for your feedback 🙏";
            text = "Thanks for rating us! We apologize for any issues and will work on improving.";
        } else {
            subject = "Thank you for your review 😊";
            text = "We’re glad you loved the product. Thanks for your support!";
        }

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject,
            text
        });

        res.status(201).json({ message: "Review submitted successfully", review: order.review });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

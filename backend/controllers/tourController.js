import Tour from "../models/Tour.js";

// create new tour
export const createTour = async (req, res) => {
    const newTour = new Tour(req.body);

    try {
        const savedTour = await newTour.save();

        res.status(200).json({
            success: true,
            message: 'Successfully created',
            data: savedTour
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to create. Try again'
        });

    }
};


// Update Tour

export const updateTour = async (req, res) => {

    const id = req.params.id;

    try {
        const updatedTour = await Tour.findByIdAndUpdate(id, { $set: req.body }, { new: true });

        res.status(200).json({
            success: true,
            message: 'Successfully updated',
            data: updatedTour
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'failed to update'
        });
    }
}

// delete Tour

export const deleteTour = async (req, res) => {
    const id = req.params.id;

    try {
        await Tour.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: 'Successfully deleted'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'failed to delete'
        });
    }
}

// getSingle Tour

export const getSingleTour = async (req, res) => {
    const id = req.params.id;

    try {
        const tour = await Tour.findById(id).populate('reviews');

        res.status(200).json({
            success: true,
            message: 'Success',
            data: tour
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: 'not found'
        });
    }
}

// getAll Tour

export const getAllTour = async (req, res) => {

    // For Pagination
    const page = parseInt(req.query.page);

    try {
        const tours = await Tour.find().populate('reviews').skip(page * 8).limit(8);

        res.status(200).json({
            success: true,
            count: tours.length,
            message: 'Success',
            data: tours
        })
    } catch (error) {
        res.status(404).json({
            success: false,
            message: 'not foud'
        })
    }
}

// Get Tour by search
export const getTourBySearch = async (req, res) => {

    const city = new RegExp(req.query.city, 'i'); // Here i means case sensitive
    const distance = parseInt(req.query.distance);
    const maxGroupSize = parseInt(req.query.maxGroupSize);

    try {
        // gte means greater than equal
        const tours = await Tour.find({
            city,
            distance: { $gte: distance },
            maxGroupSize: { $gte: maxGroupSize }
        }).populate('reviews');

        res.status(200).json({
            success: true,
            message: 'Success',
            data: tours
        })
    } catch (error) {
        res.status(404).json({
            success: false,
            message: 'not foud'
        })
    }
}

// get Featured Tour

export const getFeaturedTour = async (req, res) => {

    try {
        const tours = await Tour.find({ featured: true }).populate('reviews').limit(8);

        res.status(200).json({
            success: true,
            message: 'Success',
            data: tours
        })
    } catch (error) {
        res.status(404).json({
            success: false,
            message: 'not foud'
        })
    }
}

// get tour count

export const getTourCount = async (req, res) => {
    try {
        const tourCount = await Tour.estimatedDocumentCount()

        res.status(200).json({ success: true, data: tourCount })
    } catch (error) {
        res.status(500).json({
            success: false, 
            message: 'Failed to fetch'
        })
    }
}
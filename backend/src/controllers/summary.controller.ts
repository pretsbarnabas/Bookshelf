import {Types} from "mongoose"
const SummaryModel = require("../models/summary.model")

export class SummaryController{
    
    static async getAllSummaries(req:any,res:any){
        try{
            const summaries = await SummaryModel.find()
            res.status(200).json(summaries)
        }catch(error:any){
            res.status(500).json({message:error.message})
        }
    }

    static async getSummaryById(req:any,res:any){
        const {id} = req.params
        try{
            const summary = await SummaryModel.findById(id)
            res.status(200).json(summary)
        }catch(error:any){
            res.status(500).json({message:error.message})
        }
    }

    static async createSummary(req:any,res:any){
        const summary = req.body
        const newSummary = new SummaryModel({
            book_id: summary.book_id,
            summary: summary.summary
        })
        try{
            await newSummary.save()
            res.status(201).json(newSummary)
        }
        catch(error:any){
            res.status(500).json({message:error.message})
        }
    }

    static async deleteSummary(req:any,res:any){
        try{
            const id = req.params
            const data = await SummaryModel.findByIdAndDelete(id)
            if(data){
                res.status(200).json({message:"Summary deleted"})
            }
            else{
                res.status(404).json({message:"Summary not found"})
            }
        }
        catch(error:any){
            res.status(500).json({message:error.message})
        }
    }

    static async updateSummary(req:any,res:any){
        try{
            const id = req.params
            const summary = req.body
            const data = await SummaryModel.findByIdAndUpdate(id,summary)
            if(data){
                res.status(200).json({message:"Summary updated"})
            }
            else{
                res.status(404).json({message:"Summary not found"})
            }
        }
        catch(error:any){
            res.status(500).json({message:error.message})
        }
    }
}
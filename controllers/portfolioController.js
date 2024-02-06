const connection = require("../config/database");

exports.fetchAllBmmFromPortfolio = async (req, res) => {
  try {
    const selectAllBmmQuery = "SELECT * FROM create_sho ";

    connection.query(selectAllBmmQuery, (error, results) => {
      if (error) {
        console.error("Error fetching BMM details:", error);
        return res.status(500).json({ message: "Internal Server Error" });
      }

      // Successfully fetched sho records
      return res.status(200).json({
        message: "BMM records fetched successfully",
        BmmData: results,
      });
    });
  } catch (error) {
    console.error("Error in try-catch block:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// filterBmmByState
exports.filterBmmByState = async (req, res) => {
    let {state} = req.body

    try {
      const selectAllBmmQuery = "SELECT * FROM create_sho WHERE selectedState = ?"; 
    
      connection.query(selectAllBmmQuery, [state], (error, results) => {
        if (error) {
          console.error("Error fetching BMM details:", error);
          return res.status(500).json({ message: "Internal Server Error" });
        }
    
        // Successfully fetched sho records
        return res.status(200).json({
          message: "BMM records fetched successfully",
          FilterBmmData: results,
        });
      });
    } catch (error) {
      console.error("Error in try-catch block:", error.message);
      return res.status(500).json({ message: "Internal Server Error" });
    }
    
};

// fetchAllFranchise
exports.fetchAllFranchiseFromPortfolio = async (req,res) => {
  try {
    const selectAllFranchiseQuery = "SELECT * FROM create_franchise ";

    connection.query(selectAllFranchiseQuery, (error, results) => {
      if (error) {
        console.error("Error fetching Franchise details:", error);
        return res.status(500).json({ message: "Internal Server Error" });
      }

      // Successfully fetched sho records
      return res.status(200).json({
        message: "Franchise records fetched successfully",
        FranchiseData: results,
      });
    });
  } catch (error) {
    console.error("Error in try-catch block:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

// filterFranchiseByState
exports.filterFranchiseByState = async (req,res) => {
  let {state} = req.body

  try {
    const selectAllFranchiseQuery = "SELECT * FROM create_franchise WHERE franchiseState = ?"; 
  
    connection.query(selectAllFranchiseQuery, [state], (error, results) => {
      if (error) {
        console.error("Error fetching Franchise details:", error);
        return res.status(500).json({ message: "Internal Server Error" });
      }
  
      // Successfully fetched sho records
      return res.status(200).json({
        message: "Franchise records fetched successfully",
        FilterFranchiseData: results,
      });
    });
  } catch (error) {
    console.error("Error in try-catch block:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

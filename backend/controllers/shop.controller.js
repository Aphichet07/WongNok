import shopService from "../services/shop.service.js";

const shopController = {
  test: (req, res) => {
    console.log("Hello from shopController");

    res.status(200).json({ message: shopService.test });
  },

  getRecommandShop: async (req, res) => {
    try {
      const shops = await shopService.getRecommended();
      res.status(200).json(shops);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  },

  recommendNearby: async (req, res) => {
    try {
      const { lat, lng } = req.query;

      if (!lat || !lng) {
        return res
          .status(400)
          .json({ message: "Latitude and Longitude are required" });
      }

      const shops = await shopService.getNearbyShops(lat, lng);
      res.status(200).json(shops);
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  getShopbyName: async (req, res) => {
    try {
      const { name } = req.body;
      const shop = await shopService.getShopByName(name);
      if (!shop) {
        res.status(500).json({ message: "can not found" });
      }
      console.log("Shop : ", shop);
      res.status(200).json(shop);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  },

  filterShopAll: async (req, res) => {
    try {
      const filters = req.query;
      console.log(filters);
      console.log("Hello");
      const shops = await shopService.filterShop(filters);
      console.log(shops);
      res.status(200).json(shops);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  },
  search: async (req, res) => {
    try {
      const { q } = req.query; 

      if (!q) {
        const allShops = await shopService.getRecommended();
        return res.status(200).json(allShops);
      }

      const results = await shopService.searchGlobal(q);
      res.status(200).json(results);
    } catch (err) {
      res.status(500).json({ message: "Search failed" });
    }
  },
  filterByPrice: async (req, res) => {
    console.log("Hello from filterByPrice");
  },
  filterByStar: async (req, res) => {
    console.log("Hello from filterByStar");
  },
};

export default shopController;

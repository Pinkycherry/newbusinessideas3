// Live taxonomy (5 Nov 2026, AdSense approval): only the categories and subcategories that hold the new idea set (source: businessidea database, bbo_taxonomy_export).
// Existing legacy categories are deliberately absent from this mapping.
export type ExpansionSubcategory = { id: string; name: string; slug: string };

export const EXPANSION_SUBCATEGORIES: Record<string, ExpansionSubcategory[]> = {
  "work-from-home-business-ideas": [
    {
      "id": "C001-S01",
      "name": "Home Cooked Meal Subscription Business Ideas",
      "slug": "home-cooked-meal-subscription-business-ideas"
    },
    {
      "id": "C001-S02",
      "name": "After School Online Tuition Business Ideas",
      "slug": "after-school-online-tuition-business-ideas"
    },
    {
      "id": "C001-S03",
      "name": "Catalog Reselling From Home Business Ideas",
      "slug": "catalog-reselling-from-home-business-ideas"
    },
    {
      "id": "C001-S04",
      "name": "Home Visit Beauty Service Business Ideas",
      "slug": "home-visit-beauty-service-business-ideas"
    },
    {
      "id": "C001-S05",
      "name": "Website and Blog Writing Business Ideas",
      "slug": "website-and-blog-writing-business-ideas"
    },
    {
      "id": "C001-S06",
      "name": "Small Shop Page Handling Business Ideas",
      "slug": "small-shop-page-handling-business-ideas"
    },
    {
      "id": "C001-S07",
      "name": "Homemade Candle and Soap Business Ideas",
      "slug": "homemade-candle-and-soap-business-ideas"
    },
    {
      "id": "C001-S08",
      "name": "Remote Admin Support Business Ideas",
      "slug": "remote-admin-support-business-ideas"
    },
    {
      "id": "C001-S09",
      "name": "Printable and Digital File Selling Business Ideas",
      "slug": "printable-and-digital-file-selling-business-ideas"
    },
    {
      "id": "C001-S10",
      "name": "Live Online Workshop Business Ideas",
      "slug": "live-online-workshop-business-ideas"
    }
  ],
  "local-service-business-ideas": [
    {
      "id": "C010-S01",
      "name": "Neighbourhood Home Help Business Ideas",
      "slug": "neighbourhood-home-help-business-ideas"
    },
    {
      "id": "C010-S02",
      "name": "Building Upkeep Service Business Ideas",
      "slug": "building-upkeep-service-business-ideas"
    },
    {
      "id": "C010-S03",
      "name": "Local Parcel Movement Business Ideas",
      "slug": "local-parcel-movement-business-ideas"
    },
    {
      "id": "C010-S04",
      "name": "Doorstep Grooming Service Business Ideas",
      "slug": "doorstep-grooming-service-business-ideas"
    },
    {
      "id": "C010-S05",
      "name": "Local Print and Copy Shop Business Ideas",
      "slug": "local-print-and-copy-shop-business-ideas"
    },
    {
      "id": "C010-S06",
      "name": "Nearby Appliance Care Business Ideas",
      "slug": "nearby-appliance-care-business-ideas"
    },
    {
      "id": "C010-S07",
      "name": "Local Tutor Network Business Ideas",
      "slug": "local-tutor-network-business-ideas"
    },
    {
      "id": "C010-S08",
      "name": "Area Meal Delivery Kitchen Business Ideas",
      "slug": "area-meal-delivery-kitchen-business-ideas"
    },
    {
      "id": "C010-S09",
      "name": "Local Function Support Business Ideas",
      "slug": "local-function-support-business-ideas"
    },
    {
      "id": "C010-S10",
      "name": "Market Day Service Business Ideas",
      "slug": "market-day-service-business-ideas"
    }
  ],
  "skill-based-business-ideas": [
    {
      "id": "C011-S01",
      "name": "Trade Skill Site Work Business Ideas",
      "slug": "trade-skill-site-work-business-ideas"
    },
    {
      "id": "C011-S02",
      "name": "Paid Skill Teaching Business Ideas",
      "slug": "paid-skill-teaching-business-ideas"
    },
    {
      "id": "C011-S03",
      "name": "Maker Skill Product Business Ideas",
      "slug": "maker-skill-product-business-ideas"
    },
    {
      "id": "C011-S04",
      "name": "Repair Skill Visit Business Ideas",
      "slug": "repair-skill-visit-business-ideas"
    },
    {
      "id": "C011-S05",
      "name": "Beauty Skill Booking Business Ideas",
      "slug": "beauty-skill-booking-business-ideas"
    },
    {
      "id": "C011-S06",
      "name": "Cooking Skill Order Business Ideas",
      "slug": "cooking-skill-order-business-ideas"
    },
    {
      "id": "C011-S07",
      "name": "Digital Skill Client Work Business Ideas",
      "slug": "digital-skill-client-work-business-ideas"
    },
    {
      "id": "C011-S08",
      "name": "Language Skill Class Business Ideas",
      "slug": "language-skill-class-business-ideas"
    },
    {
      "id": "C011-S09",
      "name": "Fitness Skill Session Business Ideas",
      "slug": "fitness-skill-session-business-ideas"
    },
    {
      "id": "C011-S10",
      "name": "Craft Skill Product Business Ideas",
      "slug": "craft-skill-product-business-ideas"
    }
  ],
  "freelance-business-ideas": [
    {
      "id": "C012-S01",
      "name": "Freelance Article Client Business Ideas",
      "slug": "freelance-article-client-business-ideas"
    },
    {
      "id": "C012-S02",
      "name": "Freelance Design Project Business Ideas",
      "slug": "freelance-design-project-business-ideas"
    },
    {
      "id": "C012-S03",
      "name": "Freelance Video Edit Business Ideas",
      "slug": "freelance-video-edit-business-ideas"
    },
    {
      "id": "C012-S04",
      "name": "Freelance Website Project Business Ideas",
      "slug": "freelance-website-project-business-ideas"
    },
    {
      "id": "C012-S05",
      "name": "Freelance Marketing Retainer Business Ideas",
      "slug": "freelance-marketing-retainer-business-ideas"
    },
    {
      "id": "C012-S06",
      "name": "Freelance Translation Work Business Ideas",
      "slug": "freelance-translation-work-business-ideas"
    },
    {
      "id": "C012-S07",
      "name": "Freelance Voice Over Business Ideas",
      "slug": "freelance-voice-over-business-ideas"
    },
    {
      "id": "C012-S08",
      "name": "Freelance Coding Project Business Ideas",
      "slug": "freelance-coding-project-business-ideas"
    },
    {
      "id": "C012-S09",
      "name": "Freelance Remote Support Business Ideas",
      "slug": "freelance-remote-support-business-ideas"
    },
    {
      "id": "C012-S10",
      "name": "Freelance Advice Call Business Ideas",
      "slug": "freelance-advice-call-business-ideas"
    }
  ],
  "reselling-business-ideas": [
    {
      "id": "C013-S01",
      "name": "Fashion Catalog Reselling Business Ideas",
      "slug": "fashion-catalog-reselling-business-ideas"
    },
    {
      "id": "C013-S02",
      "name": "Beauty Item Reselling Business Ideas",
      "slug": "beauty-item-reselling-business-ideas"
    },
    {
      "id": "C013-S03",
      "name": "Home Utility Reselling Business Ideas",
      "slug": "home-utility-reselling-business-ideas"
    },
    {
      "id": "C013-S04",
      "name": "Kids Item Reselling Business Ideas",
      "slug": "kids-item-reselling-business-ideas"
    },
    {
      "id": "C013-S05",
      "name": "WhatsApp Group Reselling Business Ideas",
      "slug": "whatsapp-group-reselling-business-ideas"
    },
    {
      "id": "C013-S06",
      "name": "Closet and Thrift Reselling Business Ideas",
      "slug": "closet-and-thrift-reselling-business-ideas"
    },
    {
      "id": "C013-S07",
      "name": "Wholesale Lot to Local Sale Business Ideas",
      "slug": "wholesale-lot-to-local-sale-business-ideas"
    },
    {
      "id": "C013-S08",
      "name": "Festival Goods Reselling Business Ideas",
      "slug": "festival-goods-reselling-business-ideas"
    },
    {
      "id": "C013-S09",
      "name": "Hostel Needs Reselling Business Ideas",
      "slug": "hostel-needs-reselling-business-ideas"
    },
    {
      "id": "C013-S10",
      "name": "Daily Needs Basket Reselling Business Ideas",
      "slug": "daily-needs-basket-reselling-business-ideas"
    }
  ],
  "childcare-and-parenting-support-business-ideas": [
    {
      "id": "C014-S01",
      "name": "Home Daycare Group Business Ideas",
      "slug": "home-daycare-group-business-ideas"
    },
    {
      "id": "C014-S02",
      "name": "After School Child Watch Business Ideas",
      "slug": "after-school-child-watch-business-ideas"
    },
    {
      "id": "C014-S03",
      "name": "Baby Care Visit Service Business Ideas",
      "slug": "baby-care-visit-service-business-ideas"
    },
    {
      "id": "C014-S04",
      "name": "Parent Child Activity Batch Business Ideas",
      "slug": "parent-child-activity-batch-business-ideas"
    },
    {
      "id": "C014-S05",
      "name": "Kids Birthday Support Business Ideas",
      "slug": "kids-birthday-support-business-ideas"
    },
    {
      "id": "C014-S06",
      "name": "School Van Route Business Ideas",
      "slug": "school-van-route-business-ideas"
    },
    {
      "id": "C014-S07",
      "name": "Tuition With Child Watch Business Ideas",
      "slug": "tuition-with-child-watch-business-ideas"
    },
    {
      "id": "C014-S08",
      "name": "New Mother Home Support Business Ideas",
      "slug": "new-mother-home-support-business-ideas"
    },
    {
      "id": "C014-S09",
      "name": "Kids Hobby Group Business Ideas",
      "slug": "kids-hobby-group-business-ideas"
    },
    {
      "id": "C014-S10",
      "name": "Parent Learning Kit Business Ideas",
      "slug": "parent-learning-kit-business-ideas"
    }
  ],
  "printing-and-signage-business-ideas": [
    {
      "id": "C015-S01",
      "name": "Copy and Print Shop Business Ideas",
      "slug": "copy-and-print-shop-business-ideas"
    },
    {
      "id": "C015-S02",
      "name": "Wedding Card Print Business Ideas",
      "slug": "wedding-card-print-business-ideas"
    },
    {
      "id": "C015-S03",
      "name": "Banner and Flex Print Business Ideas",
      "slug": "banner-and-flex-print-business-ideas"
    },
    {
      "id": "C015-S04",
      "name": "Custom Apparel Print Business Ideas",
      "slug": "custom-apparel-print-business-ideas"
    },
    {
      "id": "C015-S05",
      "name": "Label and Sticker Print Business Ideas",
      "slug": "label-and-sticker-print-business-ideas"
    },
    {
      "id": "C015-S06",
      "name": "Name Plate and Stamp Shop Business Ideas",
      "slug": "name-plate-and-stamp-shop-business-ideas"
    },
    {
      "id": "C015-S07",
      "name": "Photo Book Print Business Ideas",
      "slug": "photo-book-print-business-ideas"
    },
    {
      "id": "C015-S08",
      "name": "School Print Job Business Ideas",
      "slug": "school-print-job-business-ideas"
    },
    {
      "id": "C015-S09",
      "name": "Vehicle Sticker and Graphics Business Ideas",
      "slug": "vehicle-sticker-and-graphics-business-ideas"
    },
    {
      "id": "C015-S10",
      "name": "Pack Print for Small Brands Business Ideas",
      "slug": "pack-print-for-small-brands-business-ideas"
    }
  ],
  "food-business-ideas": [
    {
      "id": "C016-S01",
      "name": "Daily Dabba Supply Business Ideas",
      "slug": "daily-dabba-supply-business-ideas"
    },
    {
      "id": "C016-S02",
      "name": "Namkeen Making and Packing Business Ideas",
      "slug": "namkeen-making-and-packing-business-ideas"
    },
    {
      "id": "C016-S03",
      "name": "Regional Thali Meal Business Ideas",
      "slug": "regional-thali-meal-business-ideas"
    },
    {
      "id": "C016-S04",
      "name": "Office Lunch Contract Business Ideas",
      "slug": "office-lunch-contract-business-ideas"
    },
    {
      "id": "C016-S05",
      "name": "Festival Food Order Business Ideas",
      "slug": "festival-food-order-business-ideas"
    },
    {
      "id": "C016-S06",
      "name": "Special Diet Meal Kitchen Business Ideas",
      "slug": "special-diet-meal-kitchen-business-ideas"
    },
    {
      "id": "C016-S07",
      "name": "Night Eatery Food Business Ideas",
      "slug": "night-eatery-food-business-ideas"
    },
    {
      "id": "C016-S08",
      "name": "House Party Food Order Business Ideas",
      "slug": "house-party-food-order-business-ideas"
    },
    {
      "id": "C016-S09",
      "name": "Travel Stop Food Business Ideas",
      "slug": "travel-stop-food-business-ideas"
    },
    {
      "id": "C016-S10",
      "name": "Hostel and Canteen Meal Business Ideas",
      "slug": "hostel-and-canteen-meal-business-ideas"
    }
  ],
  "home-kitchen-food-business-ideas": [
    {
      "id": "C017-S01",
      "name": "Homemade Pickle Brand Business Ideas",
      "slug": "homemade-pickle-brand-business-ideas"
    },
    {
      "id": "C017-S02",
      "name": "Papad Making at Home Business Ideas",
      "slug": "papad-making-at-home-business-ideas"
    },
    {
      "id": "C017-S03",
      "name": "Home Spice Mix Brand Business Ideas",
      "slug": "home-spice-mix-brand-business-ideas"
    },
    {
      "id": "C017-S04",
      "name": "Homemade Sweet Box Business Ideas",
      "slug": "homemade-sweet-box-business-ideas"
    },
    {
      "id": "C017-S05",
      "name": "Batter and Ready Mix Business Ideas",
      "slug": "batter-and-ready-mix-business-ideas"
    },
    {
      "id": "C017-S06",
      "name": "Home Chocolate Making Business Ideas",
      "slug": "home-chocolate-making-business-ideas"
    },
    {
      "id": "C017-S07",
      "name": "Dry Snack Packing at Home Business Ideas",
      "slug": "dry-snack-packing-at-home-business-ideas"
    },
    {
      "id": "C017-S08",
      "name": "Chutney and Sauce Making Business Ideas",
      "slug": "chutney-and-sauce-making-business-ideas"
    },
    {
      "id": "C017-S09",
      "name": "Festival Food Hamper Business Ideas",
      "slug": "festival-food-hamper-business-ideas"
    },
    {
      "id": "C017-S10",
      "name": "Single Dish Home Kitchen Business Ideas",
      "slug": "single-dish-home-kitchen-business-ideas"
    }
  ],
  "street-food-business-ideas": [
    {
      "id": "C018-S01",
      "name": "Chaat and Snack Cart Business Ideas",
      "slug": "chaat-and-snack-cart-business-ideas"
    },
    {
      "id": "C018-S02",
      "name": "Momos and Dumpling Stall Business Ideas",
      "slug": "momos-and-dumpling-stall-business-ideas"
    },
    {
      "id": "C018-S03",
      "name": "Roll and Wrap Stall Business Ideas",
      "slug": "roll-and-wrap-stall-business-ideas"
    },
    {
      "id": "C018-S04",
      "name": "South Indian Tiffin Stall Business Ideas",
      "slug": "south-indian-tiffin-stall-business-ideas"
    },
    {
      "id": "C018-S05",
      "name": "Juice and Shake Cart Business Ideas",
      "slug": "juice-and-shake-cart-business-ideas"
    },
    {
      "id": "C018-S06",
      "name": "Tea Stall Business Ideas",
      "slug": "tea-stall-business-ideas"
    },
    {
      "id": "C018-S07",
      "name": "Indo Chinese Stall Business Ideas",
      "slug": "indo-chinese-stall-business-ideas"
    },
    {
      "id": "C018-S08",
      "name": "Evening Fry Snack Stall Business Ideas",
      "slug": "evening-fry-snack-stall-business-ideas"
    },
    {
      "id": "C018-S09",
      "name": "Egg and Non Veg Street Stall Business Ideas",
      "slug": "egg-and-non-veg-street-stall-business-ideas"
    },
    {
      "id": "C018-S10",
      "name": "Seasonal Street Snack Business Ideas",
      "slug": "seasonal-street-snack-business-ideas"
    }
  ],
  "bakery-and-confectionery-business-ideas": [
    {
      "id": "C019-S01",
      "name": "Custom Celebration Cake Business Ideas",
      "slug": "custom-celebration-cake-business-ideas"
    },
    {
      "id": "C019-S02",
      "name": "Bread and Bun Bakery Business Ideas",
      "slug": "bread-and-bun-bakery-business-ideas"
    },
    {
      "id": "C019-S03",
      "name": "Cookie and Biscuit Batch Business Ideas",
      "slug": "cookie-and-biscuit-batch-business-ideas"
    },
    {
      "id": "C019-S04",
      "name": "Eggless Bake House Business Ideas",
      "slug": "eggless-bake-house-business-ideas"
    },
    {
      "id": "C019-S05",
      "name": "Dessert Box Bakery Business Ideas",
      "slug": "dessert-box-bakery-business-ideas"
    },
    {
      "id": "C019-S06",
      "name": "Bakery Supply to Cafes Business Ideas",
      "slug": "bakery-supply-to-cafes-business-ideas"
    },
    {
      "id": "C019-S07",
      "name": "Wedding Dessert Table Business Ideas",
      "slug": "wedding-dessert-table-business-ideas"
    },
    {
      "id": "C019-S08",
      "name": "Millet and Healthy Bake Business Ideas",
      "slug": "millet-and-healthy-bake-business-ideas"
    },
    {
      "id": "C019-S09",
      "name": "Shop Counter Bakery Business Ideas",
      "slug": "shop-counter-bakery-business-ideas"
    },
    {
      "id": "C019-S10",
      "name": "Festival Gift Bake Business Ideas",
      "slug": "festival-gift-bake-business-ideas"
    }
  ],
  "side-hustle-business-ideas": [
    {
      "id": "C002-S01",
      "name": "Evening Tuition Side Work Business Ideas",
      "slug": "evening-tuition-side-work-business-ideas"
    },
    {
      "id": "C002-S02",
      "name": "Weekend Food Stall Business Ideas",
      "slug": "weekend-food-stall-business-ideas"
    },
    {
      "id": "C002-S03",
      "name": "Social App Product Reselling Business Ideas",
      "slug": "social-app-product-reselling-business-ideas"
    },
    {
      "id": "C002-S04",
      "name": "Spare Time Design Service Business Ideas",
      "slug": "spare-time-design-service-business-ideas"
    },
    {
      "id": "C002-S05",
      "name": "Society Service Side Work Business Ideas",
      "slug": "society-service-side-work-business-ideas"
    },
    {
      "id": "C002-S06",
      "name": "Festival Season Extra Work Business Ideas",
      "slug": "festival-season-extra-work-business-ideas"
    },
    {
      "id": "C002-S07",
      "name": "Delivery Shift Side Work Business Ideas",
      "slug": "delivery-shift-side-work-business-ideas"
    },
    {
      "id": "C002-S08",
      "name": "Spare Time Content Service Business Ideas",
      "slug": "spare-time-content-service-business-ideas"
    },
    {
      "id": "C002-S09",
      "name": "Home Baking Order Side Work Business Ideas",
      "slug": "home-baking-order-side-work-business-ideas"
    },
    {
      "id": "C002-S10",
      "name": "Local Shop Support Side Work Business Ideas",
      "slug": "local-shop-support-side-work-business-ideas"
    }
  ],
  "catering-business-ideas": [
    {
      "id": "C020-S01",
      "name": "Wedding Meal Catering Business Ideas",
      "slug": "wedding-meal-catering-business-ideas"
    },
    {
      "id": "C020-S02",
      "name": "Small House Party Catering Business Ideas",
      "slug": "small-house-party-catering-business-ideas"
    },
    {
      "id": "C020-S03",
      "name": "Office Gathering Catering Business Ideas",
      "slug": "office-gathering-catering-business-ideas"
    },
    {
      "id": "C020-S04",
      "name": "Religious Function Meal Business Ideas",
      "slug": "religious-function-meal-business-ideas"
    },
    {
      "id": "C020-S05",
      "name": "Live Food Counter Business Ideas",
      "slug": "live-food-counter-business-ideas"
    },
    {
      "id": "C020-S06",
      "name": "Pure Vegetarian Catering Business Ideas",
      "slug": "pure-vegetarian-catering-business-ideas"
    },
    {
      "id": "C020-S07",
      "name": "Regional Cuisine Catering Business Ideas",
      "slug": "regional-cuisine-catering-business-ideas"
    },
    {
      "id": "C020-S08",
      "name": "Reception Snack Catering Business Ideas",
      "slug": "reception-snack-catering-business-ideas"
    },
    {
      "id": "C020-S09",
      "name": "Outdoor Function Meal Business Ideas",
      "slug": "outdoor-function-meal-business-ideas"
    },
    {
      "id": "C020-S10",
      "name": "Bulk Meal Contract Business Ideas",
      "slug": "bulk-meal-contract-business-ideas"
    }
  ],
  "cloud-kitchen-business-ideas": [
    {
      "id": "C021-S01",
      "name": "Single Cuisine Delivery Kitchen Business Ideas",
      "slug": "single-cuisine-delivery-kitchen-business-ideas"
    },
    {
      "id": "C021-S02",
      "name": "Biryani Delivery Kitchen Business Ideas",
      "slug": "biryani-delivery-kitchen-business-ideas"
    },
    {
      "id": "C021-S03",
      "name": "Grain Bowl Delivery Kitchen Business Ideas",
      "slug": "grain-bowl-delivery-kitchen-business-ideas"
    },
    {
      "id": "C021-S04",
      "name": "Breakfast Delivery Kitchen Business Ideas",
      "slug": "breakfast-delivery-kitchen-business-ideas"
    },
    {
      "id": "C021-S05",
      "name": "Late Night Delivery Kitchen Business Ideas",
      "slug": "late-night-delivery-kitchen-business-ideas"
    },
    {
      "id": "C021-S06",
      "name": "Combo Plate Delivery Kitchen Business Ideas",
      "slug": "combo-plate-delivery-kitchen-business-ideas"
    },
    {
      "id": "C021-S07",
      "name": "Thali Delivery Kitchen Business Ideas",
      "slug": "thali-delivery-kitchen-business-ideas"
    },
    {
      "id": "C021-S08",
      "name": "Dessert Delivery Kitchen Business Ideas",
      "slug": "dessert-delivery-kitchen-business-ideas"
    },
    {
      "id": "C021-S09",
      "name": "Shared Kitchen Multi Brand Business Ideas",
      "slug": "shared-kitchen-multi-brand-business-ideas"
    },
    {
      "id": "C021-S10",
      "name": "Society Area Delivery Kitchen Business Ideas",
      "slug": "society-area-delivery-kitchen-business-ideas"
    }
  ],
  "packaged-snack-business-ideas": [
    {
      "id": "C022-S01",
      "name": "Classic Namkeen Brand Business Ideas",
      "slug": "classic-namkeen-brand-business-ideas"
    },
    {
      "id": "C022-S02",
      "name": "Roasted Nut and Seed Pack Business Ideas",
      "slug": "roasted-nut-and-seed-pack-business-ideas"
    },
    {
      "id": "C022-S03",
      "name": "Millet Snack Brand Business Ideas",
      "slug": "millet-snack-brand-business-ideas"
    },
    {
      "id": "C022-S04",
      "name": "Fried and Baked Chip Business Ideas",
      "slug": "fried-and-baked-chip-business-ideas"
    },
    {
      "id": "C022-S05",
      "name": "School Snack Pack Business Ideas",
      "slug": "school-snack-pack-business-ideas"
    },
    {
      "id": "C022-S06",
      "name": "Office Pantry Snack Supply Business Ideas",
      "slug": "office-pantry-snack-supply-business-ideas"
    },
    {
      "id": "C022-S07",
      "name": "Regional Dry Snack Brand Business Ideas",
      "slug": "regional-dry-snack-brand-business-ideas"
    },
    {
      "id": "C022-S08",
      "name": "Protein Munch Pack Business Ideas",
      "slug": "protein-munch-pack-business-ideas"
    },
    {
      "id": "C022-S09",
      "name": "Festival Snack Gift Pack Business Ideas",
      "slug": "festival-snack-gift-pack-business-ideas"
    },
    {
      "id": "C022-S10",
      "name": "Savoury Mixture Brand Business Ideas",
      "slug": "savoury-mixture-brand-business-ideas"
    }
  ],
  "beverage-stall-and-drink-brand-business-ideas": [
    {
      "id": "C023-S01",
      "name": "Fresh Juice and Shake Bar Business Ideas",
      "slug": "fresh-juice-and-shake-bar-business-ideas"
    },
    {
      "id": "C023-S02",
      "name": "Tea Stall and Chai Brand Business Ideas",
      "slug": "tea-stall-and-chai-brand-business-ideas"
    },
    {
      "id": "C023-S03",
      "name": "Coffee Counter Business Ideas",
      "slug": "coffee-counter-business-ideas"
    },
    {
      "id": "C023-S04",
      "name": "Traditional Indian Cool Drink Business Ideas",
      "slug": "traditional-indian-cool-drink-business-ideas"
    },
    {
      "id": "C023-S05",
      "name": "Packaged Health Drink Mix Business Ideas",
      "slug": "packaged-health-drink-mix-business-ideas"
    },
    {
      "id": "C023-S06",
      "name": "Office Beverage Supply Business Ideas",
      "slug": "office-beverage-supply-business-ideas"
    },
    {
      "id": "C023-S07",
      "name": "Summer Drink Cart Business Ideas",
      "slug": "summer-drink-cart-business-ideas"
    },
    {
      "id": "C023-S08",
      "name": "Party Mocktail Service Business Ideas",
      "slug": "party-mocktail-service-business-ideas"
    },
    {
      "id": "C023-S09",
      "name": "Regional Drink Brand Business Ideas",
      "slug": "regional-drink-brand-business-ideas"
    },
    {
      "id": "C023-S10",
      "name": "Drink Base and Syrup Supply Business Ideas",
      "slug": "drink-base-and-syrup-supply-business-ideas"
    }
  ],
  "sweet-shop-and-mithai-business-ideas": [
    {
      "id": "C024-S01",
      "name": "Neighbourhood Mithai Shop Business Ideas",
      "slug": "neighbourhood-mithai-shop-business-ideas"
    },
    {
      "id": "C024-S02",
      "name": "Festival Sweet Order Business Ideas",
      "slug": "festival-sweet-order-business-ideas"
    },
    {
      "id": "C024-S03",
      "name": "Regional Sweet Speciality Business Ideas",
      "slug": "regional-sweet-speciality-business-ideas"
    },
    {
      "id": "C024-S04",
      "name": "Dry Fruit Sweet Box Business Ideas",
      "slug": "dry-fruit-sweet-box-business-ideas"
    },
    {
      "id": "C024-S05",
      "name": "Milk Based Sweet Making Business Ideas",
      "slug": "milk-based-sweet-making-business-ideas"
    },
    {
      "id": "C024-S06",
      "name": "Low Sugar Sweet Option Business Ideas",
      "slug": "low-sugar-sweet-option-business-ideas"
    },
    {
      "id": "C024-S07",
      "name": "Sweet Gift Hamper Business Ideas",
      "slug": "sweet-gift-hamper-business-ideas"
    },
    {
      "id": "C024-S08",
      "name": "Wedding Sweet Box Business Ideas",
      "slug": "wedding-sweet-box-business-ideas"
    },
    {
      "id": "C024-S09",
      "name": "Sweet and Snack Shop Business Ideas",
      "slug": "sweet-and-snack-shop-business-ideas"
    },
    {
      "id": "C024-S10",
      "name": "Seasonal Sweet Calendar Business Ideas",
      "slug": "seasonal-sweet-calendar-business-ideas"
    }
  ],
  "restaurant-and-eatery-business-ideas": [
    {
      "id": "C025-S01",
      "name": "Small Family Eatery Business Ideas",
      "slug": "small-family-eatery-business-ideas"
    },
    {
      "id": "C025-S02",
      "name": "Quick Service Counter Business Ideas",
      "slug": "quick-service-counter-business-ideas"
    },
    {
      "id": "C025-S03",
      "name": "Dhaba Style Meal Stop Business Ideas",
      "slug": "dhaba-style-meal-stop-business-ideas"
    },
    {
      "id": "C025-S04",
      "name": "South Indian Meals Hotel Business Ideas",
      "slug": "south-indian-meals-hotel-business-ideas"
    },
    {
      "id": "C025-S05",
      "name": "North Indian Thali House Business Ideas",
      "slug": "north-indian-thali-house-business-ideas"
    },
    {
      "id": "C025-S06",
      "name": "Casual Cafe Business Ideas",
      "slug": "casual-cafe-business-ideas"
    },
    {
      "id": "C025-S07",
      "name": "Pure Veg Eating House Business Ideas",
      "slug": "pure-veg-eating-house-business-ideas"
    },
    {
      "id": "C025-S08",
      "name": "Non Veg Speciality Eatery Business Ideas",
      "slug": "non-veg-speciality-eatery-business-ideas"
    },
    {
      "id": "C025-S09",
      "name": "Highway Meal Stop Business Ideas",
      "slug": "highway-meal-stop-business-ideas"
    },
    {
      "id": "C025-S10",
      "name": "Food Court Stall Business Ideas",
      "slug": "food-court-stall-business-ideas"
    }
  ],
  "regional-specialty-food-business-ideas": [
    {
      "id": "C026-S01",
      "name": "South Indian Food Brand Business Ideas",
      "slug": "south-indian-food-brand-business-ideas"
    },
    {
      "id": "C026-S02",
      "name": "Gujarati Thali Food Business Ideas",
      "slug": "gujarati-thali-food-business-ideas"
    },
    {
      "id": "C026-S03",
      "name": "Bengali Home Food Order Business Ideas",
      "slug": "bengali-home-food-order-business-ideas"
    },
    {
      "id": "C026-S04",
      "name": "Punjabi Meal Joint Business Ideas",
      "slug": "punjabi-meal-joint-business-ideas"
    },
    {
      "id": "C026-S05",
      "name": "Kerala Meal and Snack Business Ideas",
      "slug": "kerala-meal-and-snack-business-ideas"
    },
    {
      "id": "C026-S06",
      "name": "Maharashtrian Food Speciality Business Ideas",
      "slug": "maharashtrian-food-speciality-business-ideas"
    },
    {
      "id": "C026-S07",
      "name": "Hyderabadi Food Brand Business Ideas",
      "slug": "hyderabadi-food-brand-business-ideas"
    },
    {
      "id": "C026-S08",
      "name": "North East Food Kitchen Business Ideas",
      "slug": "north-east-food-kitchen-business-ideas"
    },
    {
      "id": "C026-S09",
      "name": "Coastal Fish Meal Business Ideas",
      "slug": "coastal-fish-meal-business-ideas"
    },
    {
      "id": "C026-S10",
      "name": "Regional Street Snack Brand Business Ideas",
      "slug": "regional-street-snack-brand-business-ideas"
    }
  ],
  "beauty-business-ideas": [
    {
      "id": "C027-S01",
      "name": "Skin Facial Service Business Ideas",
      "slug": "skin-facial-service-business-ideas"
    },
    {
      "id": "C027-S02",
      "name": "Hair Care Service Business Ideas",
      "slug": "hair-care-service-business-ideas"
    },
    {
      "id": "C027-S03",
      "name": "Bridal Makeup Artist Business Ideas",
      "slug": "bridal-makeup-artist-business-ideas"
    },
    {
      "id": "C027-S04",
      "name": "Mehendi Design Service Business Ideas",
      "slug": "mehendi-design-service-business-ideas"
    },
    {
      "id": "C027-S05",
      "name": "Nail Studio Service Business Ideas",
      "slug": "nail-studio-service-business-ideas"
    },
    {
      "id": "C027-S06",
      "name": "Basic Salon Grooming Business Ideas",
      "slug": "basic-salon-grooming-business-ideas"
    },
    {
      "id": "C027-S07",
      "name": "Beauty at Client Home Business Ideas",
      "slug": "beauty-at-client-home-business-ideas"
    },
    {
      "id": "C027-S08",
      "name": "Beauty Product Resale Business Ideas",
      "slug": "beauty-product-resale-business-ideas"
    },
    {
      "id": "C027-S09",
      "name": "Makeup Skill Class Business Ideas",
      "slug": "makeup-skill-class-business-ideas"
    },
    {
      "id": "C027-S10",
      "name": "Party Makeup Booking Business Ideas",
      "slug": "party-makeup-booking-business-ideas"
    }
  ],
  "salon-and-grooming-business-ideas": [
    {
      "id": "C028-S01",
      "name": "Women Beauty Parlour Business Ideas",
      "slug": "women-beauty-parlour-business-ideas"
    },
    {
      "id": "C028-S02",
      "name": "Men Hair Salon Business Ideas",
      "slug": "men-hair-salon-business-ideas"
    },
    {
      "id": "C028-S03",
      "name": "Unisex Local Salon Business Ideas",
      "slug": "unisex-local-salon-business-ideas"
    },
    {
      "id": "C028-S04",
      "name": "Kids Haircut Chair Business Ideas",
      "slug": "kids-haircut-chair-business-ideas"
    },
    {
      "id": "C028-S05",
      "name": "Classic Barber Shop Business Ideas",
      "slug": "classic-barber-shop-business-ideas"
    },
    {
      "id": "C028-S06",
      "name": "Skin and Body Care Room Business Ideas",
      "slug": "skin-and-body-care-room-business-ideas"
    },
    {
      "id": "C028-S07",
      "name": "Salon Studio at Home Business Ideas",
      "slug": "salon-studio-at-home-business-ideas"
    },
    {
      "id": "C028-S08",
      "name": "Salon Retail Shelf Business Ideas",
      "slug": "salon-retail-shelf-business-ideas"
    },
    {
      "id": "C028-S09",
      "name": "Grooming Membership Plan Business Ideas",
      "slug": "grooming-membership-plan-business-ideas"
    },
    {
      "id": "C028-S10",
      "name": "Salon Assistant Training Business Ideas",
      "slug": "salon-assistant-training-business-ideas"
    }
  ],
  "bridal-and-wedding-beauty-business-ideas": [
    {
      "id": "C029-S01",
      "name": "Full Bridal Makeup Booking Business Ideas",
      "slug": "full-bridal-makeup-booking-business-ideas"
    },
    {
      "id": "C029-S02",
      "name": "Bridal Mehendi Team Business Ideas",
      "slug": "bridal-mehendi-team-business-ideas"
    },
    {
      "id": "C029-S03",
      "name": "Family Function Makeup Business Ideas",
      "slug": "family-function-makeup-business-ideas"
    },
    {
      "id": "C029-S04",
      "name": "Groom Wedding Grooming Business Ideas",
      "slug": "groom-wedding-grooming-business-ideas"
    },
    {
      "id": "C029-S05",
      "name": "Outstation Wedding Beauty Business Ideas",
      "slug": "outstation-wedding-beauty-business-ideas"
    },
    {
      "id": "C029-S06",
      "name": "Pre Wedding Skin Care Business Ideas",
      "slug": "pre-wedding-skin-care-business-ideas"
    },
    {
      "id": "C029-S07",
      "name": "Wedding Hair Draping Business Ideas",
      "slug": "wedding-hair-draping-business-ideas"
    },
    {
      "id": "C029-S08",
      "name": "Bridesmaid Makeup Set Business Ideas",
      "slug": "bridesmaid-makeup-set-business-ideas"
    },
    {
      "id": "C029-S09",
      "name": "Makeup Trial Studio Business Ideas",
      "slug": "makeup-trial-studio-business-ideas"
    },
    {
      "id": "C029-S10",
      "name": "Guest and Festive Makeup Business Ideas",
      "slug": "guest-and-festive-makeup-business-ideas"
    }
  ],
  "part-time-business-ideas": [
    {
      "id": "C003-S01",
      "name": "Morning Meal Round Business Ideas",
      "slug": "morning-meal-round-business-ideas"
    },
    {
      "id": "C003-S02",
      "name": "After Office Coaching Batch Business Ideas",
      "slug": "after-office-coaching-batch-business-ideas"
    },
    {
      "id": "C003-S03",
      "name": "Weekend Market Stall Business Ideas",
      "slug": "weekend-market-stall-business-ideas"
    },
    {
      "id": "C003-S04",
      "name": "Part Time Shop Accounts Help Business Ideas",
      "slug": "part-time-shop-accounts-help-business-ideas"
    },
    {
      "id": "C003-S05",
      "name": "Evening Hobby Batch Business Ideas",
      "slug": "evening-hobby-batch-business-ideas"
    },
    {
      "id": "C003-S06",
      "name": "Part Time Event Photography Business Ideas",
      "slug": "part-time-event-photography-business-ideas"
    },
    {
      "id": "C003-S07",
      "name": "Weekend Catering Order Business Ideas",
      "slug": "weekend-catering-order-business-ideas"
    },
    {
      "id": "C003-S08",
      "name": "Part Time Online Selling Business Ideas",
      "slug": "part-time-online-selling-business-ideas"
    },
    {
      "id": "C003-S09",
      "name": "School Gate Help Service Business Ideas",
      "slug": "school-gate-help-service-business-ideas"
    },
    {
      "id": "C003-S10",
      "name": "Part Time Repair Visit Business Ideas",
      "slug": "part-time-repair-visit-business-ideas"
    }
  ],
  "fashion-and-apparel-business-ideas": [
    {
      "id": "C030-S01",
      "name": "Ethnic Wear for Women Business Ideas",
      "slug": "ethnic-wear-for-women-business-ideas"
    },
    {
      "id": "C030-S02",
      "name": "Daily Western Wear Selling Business Ideas",
      "slug": "daily-western-wear-selling-business-ideas"
    },
    {
      "id": "C030-S03",
      "name": "Kids Wear Label Business Ideas",
      "slug": "kids-wear-label-business-ideas"
    },
    {
      "id": "C030-S04",
      "name": "Men Casual Wear Selling Business Ideas",
      "slug": "men-casual-wear-selling-business-ideas"
    },
    {
      "id": "C030-S05",
      "name": "Saree Selling Business Ideas",
      "slug": "saree-selling-business-ideas"
    },
    {
      "id": "C030-S06",
      "name": "Inclusive Size Clothing Business Ideas",
      "slug": "inclusive-size-clothing-business-ideas"
    },
    {
      "id": "C030-S07",
      "name": "Campus Wear Label Business Ideas",
      "slug": "campus-wear-label-business-ideas"
    },
    {
      "id": "C030-S08",
      "name": "Workwear and Uniform Supply Business Ideas",
      "slug": "workwear-and-uniform-supply-business-ideas"
    },
    {
      "id": "C030-S09",
      "name": "Seasonal Clothing Drop Business Ideas",
      "slug": "seasonal-clothing-drop-business-ideas"
    },
    {
      "id": "C030-S10",
      "name": "Preowned Clothing Trade Business Ideas",
      "slug": "preowned-clothing-trade-business-ideas"
    }
  ],
  "tailoring-and-boutique-business-ideas": [
    {
      "id": "C031-S01",
      "name": "Ladies Tailoring Shop Business Ideas",
      "slug": "ladies-tailoring-shop-business-ideas"
    },
    {
      "id": "C031-S02",
      "name": "Blouse and Ethnic Stitching Business Ideas",
      "slug": "blouse-and-ethnic-stitching-business-ideas"
    },
    {
      "id": "C031-S03",
      "name": "Alteration Desk Business Ideas",
      "slug": "alteration-desk-business-ideas"
    },
    {
      "id": "C031-S04",
      "name": "Small Designer Boutique Business Ideas",
      "slug": "small-designer-boutique-business-ideas"
    },
    {
      "id": "C031-S05",
      "name": "Men Formal Stitching Business Ideas",
      "slug": "men-formal-stitching-business-ideas"
    },
    {
      "id": "C031-S06",
      "name": "Children Dress Stitching Business Ideas",
      "slug": "children-dress-stitching-business-ideas"
    },
    {
      "id": "C031-S07",
      "name": "Home Visiting Tailor Business Ideas",
      "slug": "home-visiting-tailor-business-ideas"
    },
    {
      "id": "C031-S08",
      "name": "Embroidery Work Add On Business Ideas",
      "slug": "embroidery-work-add-on-business-ideas"
    },
    {
      "id": "C031-S09",
      "name": "Outfit Hire Boutique Business Ideas",
      "slug": "outfit-hire-boutique-business-ideas"
    },
    {
      "id": "C031-S10",
      "name": "Bulk Stitching Order Business Ideas",
      "slug": "bulk-stitching-order-business-ideas"
    }
  ],
  "jewellery-and-accessories-business-ideas": [
    {
      "id": "C032-S01",
      "name": "Fashion Jewellery Selling Business Ideas",
      "slug": "fashion-jewellery-selling-business-ideas"
    },
    {
      "id": "C032-S02",
      "name": "Handmade Jewellery Bench Business Ideas",
      "slug": "handmade-jewellery-bench-business-ideas"
    },
    {
      "id": "C032-S03",
      "name": "Silver Ornament Shop Business Ideas",
      "slug": "silver-ornament-shop-business-ideas"
    },
    {
      "id": "C032-S04",
      "name": "Bridal Jewellery Set Business Ideas",
      "slug": "bridal-jewellery-set-business-ideas"
    },
    {
      "id": "C032-S05",
      "name": "Daily Wear Accessory Business Ideas",
      "slug": "daily-wear-accessory-business-ideas"
    },
    {
      "id": "C032-S06",
      "name": "Men Accessory Counter Business Ideas",
      "slug": "men-accessory-counter-business-ideas"
    },
    {
      "id": "C032-S07",
      "name": "Temple Jewellery Line Business Ideas",
      "slug": "temple-jewellery-line-business-ideas"
    },
    {
      "id": "C032-S08",
      "name": "Name and Custom Jewel Business Ideas",
      "slug": "name-and-custom-jewel-business-ideas"
    },
    {
      "id": "C032-S09",
      "name": "Home Based Jewel Order Business Ideas",
      "slug": "home-based-jewel-order-business-ideas"
    },
    {
      "id": "C032-S10",
      "name": "Boutique Counter Accessory Business Ideas",
      "slug": "boutique-counter-accessory-business-ideas"
    }
  ],
  "footwear-and-bag-business-ideas": [
    {
      "id": "C033-S01",
      "name": "Women Footwear Shop Business Ideas",
      "slug": "women-footwear-shop-business-ideas"
    },
    {
      "id": "C033-S02",
      "name": "School Shoe Supply Business Ideas",
      "slug": "school-shoe-supply-business-ideas"
    },
    {
      "id": "C033-S03",
      "name": "Men Daily Shoe Shop Business Ideas",
      "slug": "men-daily-shoe-shop-business-ideas"
    },
    {
      "id": "C033-S04",
      "name": "Handbag Selling Business Ideas",
      "slug": "handbag-selling-business-ideas"
    },
    {
      "id": "C033-S05",
      "name": "Travel Bag Shop Business Ideas",
      "slug": "travel-bag-shop-business-ideas"
    },
    {
      "id": "C033-S06",
      "name": "Ethnic Footwear Line Business Ideas",
      "slug": "ethnic-footwear-line-business-ideas"
    },
    {
      "id": "C033-S07",
      "name": "Shoe Repair Desk Business Ideas",
      "slug": "shoe-repair-desk-business-ideas"
    },
    {
      "id": "C033-S08",
      "name": "Children Footwear Shop Business Ideas",
      "slug": "children-footwear-shop-business-ideas"
    },
    {
      "id": "C033-S09",
      "name": "Office Bag Selling Business Ideas",
      "slug": "office-bag-selling-business-ideas"
    },
    {
      "id": "C033-S10",
      "name": "Footwear Selling Online Business Ideas",
      "slug": "footwear-selling-online-business-ideas"
    }
  ],
  "handmade-product-business-ideas": [
    {
      "id": "C034-S01",
      "name": "Scented Candle Studio Business Ideas",
      "slug": "scented-candle-studio-business-ideas"
    },
    {
      "id": "C034-S02",
      "name": "Cold Process Soap Studio Business Ideas",
      "slug": "cold-process-soap-studio-business-ideas"
    },
    {
      "id": "C034-S03",
      "name": "Resin Gift Studio Business Ideas",
      "slug": "resin-gift-studio-business-ideas"
    },
    {
      "id": "C034-S04",
      "name": "Wall Hanging Craft Business Ideas",
      "slug": "wall-hanging-craft-business-ideas"
    },
    {
      "id": "C034-S05",
      "name": "Handmade Paper Gift Business Ideas",
      "slug": "handmade-paper-gift-business-ideas"
    },
    {
      "id": "C034-S06",
      "name": "Clay and Pottery Studio Business Ideas",
      "slug": "clay-and-pottery-studio-business-ideas"
    },
    {
      "id": "C034-S07",
      "name": "Cloth Doll and Soft Toy Business Ideas",
      "slug": "cloth-doll-and-soft-toy-business-ideas"
    },
    {
      "id": "C034-S08",
      "name": "Dried Flower Craft Business Ideas",
      "slug": "dried-flower-craft-business-ideas"
    },
    {
      "id": "C034-S09",
      "name": "Custom Commission Craft Business Ideas",
      "slug": "custom-commission-craft-business-ideas"
    },
    {
      "id": "C034-S10",
      "name": "Craft Market Selling Business Ideas",
      "slug": "craft-market-selling-business-ideas"
    }
  ],
  "personal-care-product-business-ideas": [
    {
      "id": "C035-S01",
      "name": "Herbal Hair Oil Brand Business Ideas",
      "slug": "herbal-hair-oil-brand-business-ideas"
    },
    {
      "id": "C035-S02",
      "name": "Simple Skin Product Brand Business Ideas",
      "slug": "simple-skin-product-brand-business-ideas"
    },
    {
      "id": "C035-S03",
      "name": "Incense Stick Making Business Ideas",
      "slug": "incense-stick-making-business-ideas"
    },
    {
      "id": "C035-S04",
      "name": "Lip Balm and Salve Making Business Ideas",
      "slug": "lip-balm-and-salve-making-business-ideas"
    },
    {
      "id": "C035-S05",
      "name": "Baby Care Herbal Line Business Ideas",
      "slug": "baby-care-herbal-line-business-ideas"
    },
    {
      "id": "C035-S06",
      "name": "Men Grooming Product Line Business Ideas",
      "slug": "men-grooming-product-line-business-ideas"
    },
    {
      "id": "C035-S07",
      "name": "Bath Product Making Business Ideas",
      "slug": "bath-product-making-business-ideas"
    },
    {
      "id": "C035-S08",
      "name": "Herbal Face Pack Mix Business Ideas",
      "slug": "herbal-face-pack-mix-business-ideas"
    },
    {
      "id": "C035-S09",
      "name": "Salon Use Product Supply Business Ideas",
      "slug": "salon-use-product-supply-business-ideas"
    },
    {
      "id": "C035-S10",
      "name": "Personal Care Gift Kit Business Ideas",
      "slug": "personal-care-gift-kit-business-ideas"
    }
  ],
  "home-textile-business-ideas": [
    {
      "id": "C036-S01",
      "name": "Bed Linen Selling Business Ideas",
      "slug": "bed-linen-selling-business-ideas"
    },
    {
      "id": "C036-S02",
      "name": "Curtain Making Business Ideas",
      "slug": "curtain-making-business-ideas"
    },
    {
      "id": "C036-S03",
      "name": "Cushion Cover Making Business Ideas",
      "slug": "cushion-cover-making-business-ideas"
    },
    {
      "id": "C036-S04",
      "name": "Quilt and Blanket Making Business Ideas",
      "slug": "quilt-and-blanket-making-business-ideas"
    },
    {
      "id": "C036-S05",
      "name": "Kitchen Textile Making Business Ideas",
      "slug": "kitchen-textile-making-business-ideas"
    },
    {
      "id": "C036-S06",
      "name": "Baby Bedding Making Business Ideas",
      "slug": "baby-bedding-making-business-ideas"
    },
    {
      "id": "C036-S07",
      "name": "Named Textile Gift Business Ideas",
      "slug": "named-textile-gift-business-ideas"
    },
    {
      "id": "C036-S08",
      "name": "Handloom Fabric Selling Business Ideas",
      "slug": "handloom-fabric-selling-business-ideas"
    },
    {
      "id": "C036-S09",
      "name": "Stitching Cloth Supply Business Ideas",
      "slug": "stitching-cloth-supply-business-ideas"
    },
    {
      "id": "C036-S10",
      "name": "Made to Order Home Linen Business Ideas",
      "slug": "made-to-order-home-linen-business-ideas"
    }
  ],
  "education-business-ideas": [
    {
      "id": "C037-S01",
      "name": "School Subject Class Business Ideas",
      "slug": "school-subject-class-business-ideas"
    },
    {
      "id": "C037-S02",
      "name": "College Subject Support Business Ideas",
      "slug": "college-subject-support-business-ideas"
    },
    {
      "id": "C037-S03",
      "name": "Spoken English Batch Business Ideas",
      "slug": "spoken-english-batch-business-ideas"
    },
    {
      "id": "C037-S04",
      "name": "Short Skill Course Business Ideas",
      "slug": "short-skill-course-business-ideas"
    },
    {
      "id": "C037-S05",
      "name": "Early Learner Class Business Ideas",
      "slug": "early-learner-class-business-ideas"
    },
    {
      "id": "C037-S06",
      "name": "Adult Learning Batch Business Ideas",
      "slug": "adult-learning-batch-business-ideas"
    },
    {
      "id": "C037-S07",
      "name": "Study Guide Selling Business Ideas",
      "slug": "study-guide-selling-business-ideas"
    },
    {
      "id": "C037-S08",
      "name": "Course and College Guidance Business Ideas",
      "slug": "course-and-college-guidance-business-ideas"
    },
    {
      "id": "C037-S09",
      "name": "Catch Up Learning Batch Business Ideas",
      "slug": "catch-up-learning-batch-business-ideas"
    },
    {
      "id": "C037-S10",
      "name": "Small Group Class Business Ideas",
      "slug": "small-group-class-business-ideas"
    }
  ],
  "tuition-and-coaching-business-ideas": [
    {
      "id": "C038-S01",
      "name": "Board Exam Tuition Business Ideas",
      "slug": "board-exam-tuition-business-ideas"
    },
    {
      "id": "C038-S02",
      "name": "Primary Grade Tuition Business Ideas",
      "slug": "primary-grade-tuition-business-ideas"
    },
    {
      "id": "C038-S03",
      "name": "Maths Tuition Batch Business Ideas",
      "slug": "maths-tuition-batch-business-ideas"
    },
    {
      "id": "C038-S04",
      "name": "Science Tuition Batch Business Ideas",
      "slug": "science-tuition-batch-business-ideas"
    },
    {
      "id": "C038-S05",
      "name": "Commerce Tuition Batch Business Ideas",
      "slug": "commerce-tuition-batch-business-ideas"
    },
    {
      "id": "C038-S06",
      "name": "Tutor at Student Home Business Ideas",
      "slug": "tutor-at-student-home-business-ideas"
    },
    {
      "id": "C038-S07",
      "name": "Local Tuition Centre Business Ideas",
      "slug": "local-tuition-centre-business-ideas"
    },
    {
      "id": "C038-S08",
      "name": "Live Online Tuition Business Ideas",
      "slug": "live-online-tuition-business-ideas"
    },
    {
      "id": "C038-S09",
      "name": "Weekly Test Batch Business Ideas",
      "slug": "weekly-test-batch-business-ideas"
    },
    {
      "id": "C038-S10",
      "name": "Holiday Revision Batch Business Ideas",
      "slug": "holiday-revision-batch-business-ideas"
    }
  ],
  "competitive-exam-coaching-business-ideas": [
    {
      "id": "C039-S01",
      "name": "SSC Coaching Batch Business Ideas",
      "slug": "ssc-coaching-batch-business-ideas"
    },
    {
      "id": "C039-S02",
      "name": "Bank Exam Coaching Business Ideas",
      "slug": "bank-exam-coaching-business-ideas"
    },
    {
      "id": "C039-S03",
      "name": "Railway Exam Coaching Business Ideas",
      "slug": "railway-exam-coaching-business-ideas"
    },
    {
      "id": "C039-S04",
      "name": "Medical Entrance Support Business Ideas",
      "slug": "medical-entrance-support-business-ideas"
    },
    {
      "id": "C039-S05",
      "name": "Engineering Entrance Support Business Ideas",
      "slug": "engineering-entrance-support-business-ideas"
    },
    {
      "id": "C039-S06",
      "name": "State Service Exam Coaching Business Ideas",
      "slug": "state-service-exam-coaching-business-ideas"
    },
    {
      "id": "C039-S07",
      "name": "Defence Exam Coaching Business Ideas",
      "slug": "defence-exam-coaching-business-ideas"
    },
    {
      "id": "C039-S08",
      "name": "Teacher Eligibility Coaching Business Ideas",
      "slug": "teacher-eligibility-coaching-business-ideas"
    },
    {
      "id": "C039-S09",
      "name": "University Entrance Coaching Business Ideas",
      "slug": "university-entrance-coaching-business-ideas"
    },
    {
      "id": "C039-S10",
      "name": "Daily Current Affairs Batch Business Ideas",
      "slug": "daily-current-affairs-batch-business-ideas"
    }
  ],
  "online-business-ideas": [
    {
      "id": "C004-S01",
      "name": "Own Brand Online Store Business Ideas",
      "slug": "own-brand-online-store-business-ideas"
    },
    {
      "id": "C004-S02",
      "name": "Marketplace Seller Account Business Ideas",
      "slug": "marketplace-seller-account-business-ideas"
    },
    {
      "id": "C004-S03",
      "name": "Online Course Selling Business Ideas",
      "slug": "online-course-selling-business-ideas"
    },
    {
      "id": "C004-S04",
      "name": "Niche Information Website Business Ideas",
      "slug": "niche-information-website-business-ideas"
    },
    {
      "id": "C004-S05",
      "name": "Remote Client Service Business Ideas",
      "slug": "remote-client-service-business-ideas"
    },
    {
      "id": "C004-S06",
      "name": "WhatsApp and Instagram Shop Business Ideas",
      "slug": "whatsapp-and-instagram-shop-business-ideas"
    },
    {
      "id": "C004-S07",
      "name": "Print on Demand Product Business Ideas",
      "slug": "print-on-demand-product-business-ideas"
    },
    {
      "id": "C004-S08",
      "name": "Paid Online Community Business Ideas",
      "slug": "paid-online-community-business-ideas"
    },
    {
      "id": "C004-S09",
      "name": "Digital Download Shop Business Ideas",
      "slug": "digital-download-shop-business-ideas"
    },
    {
      "id": "C004-S10",
      "name": "Online Booking Service Business Ideas",
      "slug": "online-booking-service-business-ideas"
    }
  ],
  "digital-marketing-business-ideas": [
    {
      "id": "C047-S01",
      "name": "Local Search Visibility Service Business Ideas",
      "slug": "local-search-visibility-service-business-ideas"
    },
    {
      "id": "C047-S02",
      "name": "Map Listing Management Business Ideas",
      "slug": "map-listing-management-business-ideas"
    },
    {
      "id": "C047-S03",
      "name": "Ad Account Handling for Shops Business Ideas",
      "slug": "ad-account-handling-for-shops-business-ideas"
    },
    {
      "id": "C047-S04",
      "name": "Social Posting Service Business Ideas",
      "slug": "social-posting-service-business-ideas"
    },
    {
      "id": "C047-S05",
      "name": "WhatsApp Broadcast Service Business Ideas",
      "slug": "whatsapp-broadcast-service-business-ideas"
    },
    {
      "id": "C047-S06",
      "name": "Review and Reply Handling Business Ideas",
      "slug": "review-and-reply-handling-business-ideas"
    },
    {
      "id": "C047-S07",
      "name": "Product Listing Improvement Business Ideas",
      "slug": "product-listing-improvement-business-ideas"
    },
    {
      "id": "C047-S08",
      "name": "Monthly Content Plan Service Business Ideas",
      "slug": "monthly-content-plan-service-business-ideas"
    },
    {
      "id": "C047-S09",
      "name": "Home Based Marketing Desk Business Ideas",
      "slug": "home-based-marketing-desk-business-ideas"
    },
    {
      "id": "C047-S10",
      "name": "Festival Campaign Creative Business Ideas",
      "slug": "festival-campaign-creative-business-ideas"
    }
  ],
  "home-based-business-ideas": [
    {
      "id": "C005-S01",
      "name": "Home Tailoring Work Business Ideas",
      "slug": "home-tailoring-work-business-ideas"
    },
    {
      "id": "C005-S02",
      "name": "Home Pickle and Papad Business Ideas",
      "slug": "home-pickle-and-papad-business-ideas"
    },
    {
      "id": "C005-S03",
      "name": "Home Beauty Studio Business Ideas",
      "slug": "home-beauty-studio-business-ideas"
    },
    {
      "id": "C005-S04",
      "name": "Home Tuition Batch Business Ideas",
      "slug": "home-tuition-batch-business-ideas"
    },
    {
      "id": "C005-S05",
      "name": "Home Garment Making Business Ideas",
      "slug": "home-garment-making-business-ideas"
    },
    {
      "id": "C005-S06",
      "name": "Home Packed Food Brand Business Ideas",
      "slug": "home-packed-food-brand-business-ideas"
    },
    {
      "id": "C005-S07",
      "name": "Home Child Care Business Ideas",
      "slug": "home-child-care-business-ideas"
    },
    {
      "id": "C005-S08",
      "name": "Home Jewellery Making Business Ideas",
      "slug": "home-jewellery-making-business-ideas"
    },
    {
      "id": "C005-S09",
      "name": "Home Computer Class Business Ideas",
      "slug": "home-computer-class-business-ideas"
    },
    {
      "id": "C005-S10",
      "name": "Home Wash and Iron Business Ideas",
      "slug": "home-wash-and-iron-business-ideas"
    }
  ],
  "e-commerce-selling-business-ideas": [
    {
      "id": "C056-S01",
      "name": "Large Marketplace Seller Business Ideas",
      "slug": "large-marketplace-seller-business-ideas"
    },
    {
      "id": "C056-S02",
      "name": "Fashion Marketplace Seller Business Ideas",
      "slug": "fashion-marketplace-seller-business-ideas"
    },
    {
      "id": "C056-S03",
      "name": "Supplier Catalog Selling Business Ideas",
      "slug": "supplier-catalog-selling-business-ideas"
    },
    {
      "id": "C056-S04",
      "name": "Own Domain Shop Business Ideas",
      "slug": "own-domain-shop-business-ideas"
    },
    {
      "id": "C056-S05",
      "name": "Social Checkout Selling Business Ideas",
      "slug": "social-checkout-selling-business-ideas"
    },
    {
      "id": "C056-S06",
      "name": "Narrow Product Online Brand Business Ideas",
      "slug": "narrow-product-online-brand-business-ideas"
    },
    {
      "id": "C056-S07",
      "name": "Regional Goods to All India Business Ideas",
      "slug": "regional-goods-to-all-india-business-ideas"
    },
    {
      "id": "C056-S08",
      "name": "Gift Box Online Brand Business Ideas",
      "slug": "gift-box-online-brand-business-ideas"
    },
    {
      "id": "C056-S09",
      "name": "Repeat Delivery Box Business Ideas",
      "slug": "repeat-delivery-box-business-ideas"
    },
    {
      "id": "C056-S10",
      "name": "Listing and Dispatch Help Business Ideas",
      "slug": "listing-and-dispatch-help-business-ideas"
    }
  ],
  "affiliate-and-content-site-business-ideas": [
    {
      "id": "C057-S01",
      "name": "Product Review Website Business Ideas",
      "slug": "product-review-website-business-ideas"
    },
    {
      "id": "C057-S02",
      "name": "Offer and Deal Page Business Ideas",
      "slug": "offer-and-deal-page-business-ideas"
    },
    {
      "id": "C057-S03",
      "name": "Buyer Comparison Article Business Ideas",
      "slug": "buyer-comparison-article-business-ideas"
    },
    {
      "id": "C057-S04",
      "name": "Regional How To Site Business Ideas",
      "slug": "regional-how-to-site-business-ideas"
    },
    {
      "id": "C057-S05",
      "name": "Video Product Mention Business Ideas",
      "slug": "video-product-mention-business-ideas"
    },
    {
      "id": "C057-S06",
      "name": "Deal Sharing Group Business Ideas",
      "slug": "deal-sharing-group-business-ideas"
    },
    {
      "id": "C057-S07",
      "name": "Email Product Pick Letter Business Ideas",
      "slug": "email-product-pick-letter-business-ideas"
    },
    {
      "id": "C057-S08",
      "name": "Image Pin Product Page Business Ideas",
      "slug": "image-pin-product-page-business-ideas"
    },
    {
      "id": "C057-S09",
      "name": "Exam Resource Referral Site Business Ideas",
      "slug": "exam-resource-referral-site-business-ideas"
    },
    {
      "id": "C057-S10",
      "name": "Local Service Referral Page Business Ideas",
      "slug": "local-service-referral-page-business-ideas"
    }
  ],
  "women-friendly-business-ideas": [
    {
      "id": "C006-S01",
      "name": "Women Led Home Food Business Ideas",
      "slug": "women-led-home-food-business-ideas"
    },
    {
      "id": "C006-S02",
      "name": "Women Led Beauty Work Business Ideas",
      "slug": "women-led-beauty-work-business-ideas"
    },
    {
      "id": "C006-S03",
      "name": "Women Led Stitching Work Business Ideas",
      "slug": "women-led-stitching-work-business-ideas"
    },
    {
      "id": "C006-S04",
      "name": "Homemaker Reselling Business Ideas",
      "slug": "homemaker-reselling-business-ideas"
    },
    {
      "id": "C006-S05",
      "name": "Women Led Teaching From Home Business Ideas",
      "slug": "women-led-teaching-from-home-business-ideas"
    },
    {
      "id": "C006-S06",
      "name": "Women Led Craft Brand Business Ideas",
      "slug": "women-led-craft-brand-business-ideas"
    },
    {
      "id": "C006-S07",
      "name": "Women Group Catering Business Ideas",
      "slug": "women-group-catering-business-ideas"
    },
    {
      "id": "C006-S08",
      "name": "Women Wellness Service Business Ideas",
      "slug": "women-wellness-service-business-ideas"
    },
    {
      "id": "C006-S09",
      "name": "Women Led Kids Class Business Ideas",
      "slug": "women-led-kids-class-business-ideas"
    },
    {
      "id": "C006-S10",
      "name": "Homemaker Online Service Business Ideas",
      "slug": "homemaker-online-service-business-ideas"
    }
  ],
  "student-business-ideas": [
    {
      "id": "C007-S01",
      "name": "Study Notes Selling Business Ideas",
      "slug": "study-notes-selling-business-ideas"
    },
    {
      "id": "C007-S02",
      "name": "Student Freelance Skill Business Ideas",
      "slug": "student-freelance-skill-business-ideas"
    },
    {
      "id": "C007-S03",
      "name": "College Event Coverage Business Ideas",
      "slug": "college-event-coverage-business-ideas"
    },
    {
      "id": "C007-S04",
      "name": "Student Social Selling Business Ideas",
      "slug": "student-social-selling-business-ideas"
    },
    {
      "id": "C007-S05",
      "name": "Peer Tutoring by Students Business Ideas",
      "slug": "peer-tutoring-by-students-business-ideas"
    },
    {
      "id": "C007-S06",
      "name": "Campus Snack Selling Business Ideas",
      "slug": "campus-snack-selling-business-ideas"
    },
    {
      "id": "C007-S07",
      "name": "Student Creator Channel Business Ideas",
      "slug": "student-creator-channel-business-ideas"
    },
    {
      "id": "C007-S08",
      "name": "College Fest Stall Business Ideas",
      "slug": "college-fest-stall-business-ideas"
    },
    {
      "id": "C007-S09",
      "name": "Student Page Handling Business Ideas",
      "slug": "student-page-handling-business-ideas"
    },
    {
      "id": "C007-S10",
      "name": "Campus Print and Design Service Business Ideas",
      "slug": "campus-print-and-design-service-business-ideas"
    }
  ],
  "senior-citizen-business-ideas": [
    {
      "id": "C008-S01",
      "name": "Retired Teacher Class Business Ideas",
      "slug": "retired-teacher-class-business-ideas"
    },
    {
      "id": "C008-S02",
      "name": "Experience Based Advice Service Business Ideas",
      "slug": "experience-based-advice-service-business-ideas"
    },
    {
      "id": "C008-S03",
      "name": "Senior Home Kitchen Brand Business Ideas",
      "slug": "senior-home-kitchen-brand-business-ideas"
    },
    {
      "id": "C008-S04",
      "name": "Retired Society Service Business Ideas",
      "slug": "retired-society-service-business-ideas"
    },
    {
      "id": "C008-S05",
      "name": "Hobby Teaching by Seniors Business Ideas",
      "slug": "hobby-teaching-by-seniors-business-ideas"
    },
    {
      "id": "C008-S06",
      "name": "Senior Plant Nursery Business Ideas",
      "slug": "senior-plant-nursery-business-ideas"
    },
    {
      "id": "C008-S07",
      "name": "Retired Accounts Help Business Ideas",
      "slug": "retired-accounts-help-business-ideas"
    },
    {
      "id": "C008-S08",
      "name": "Senior Writing and Editing Business Ideas",
      "slug": "senior-writing-and-editing-business-ideas"
    },
    {
      "id": "C008-S09",
      "name": "Senior Led Local Walks Business Ideas",
      "slug": "senior-led-local-walks-business-ideas"
    },
    {
      "id": "C008-S10",
      "name": "Career Mentoring by Seniors Business Ideas",
      "slug": "career-mentoring-by-seniors-business-ideas"
    }
  ],
  "village-and-small-town-business-ideas": [
    {
      "id": "C009-S01",
      "name": "Village Daily Needs Shop Business Ideas",
      "slug": "village-daily-needs-shop-business-ideas"
    },
    {
      "id": "C009-S02",
      "name": "Small Town Tuition Centre Business Ideas",
      "slug": "small-town-tuition-centre-business-ideas"
    },
    {
      "id": "C009-S03",
      "name": "Village Milk Collection Business Ideas",
      "slug": "village-milk-collection-business-ideas"
    },
    {
      "id": "C009-S04",
      "name": "Small Town Beauty Parlour Business Ideas",
      "slug": "small-town-beauty-parlour-business-ideas"
    },
    {
      "id": "C009-S05",
      "name": "Farm Input Retail Shop Business Ideas",
      "slug": "farm-input-retail-shop-business-ideas"
    },
    {
      "id": "C009-S06",
      "name": "Village Spice and Flour Mill Business Ideas",
      "slug": "village-spice-and-flour-mill-business-ideas"
    },
    {
      "id": "C009-S07",
      "name": "Small Town Phone Repair Business Ideas",
      "slug": "small-town-phone-repair-business-ideas"
    },
    {
      "id": "C009-S08",
      "name": "Village Function Catering Business Ideas",
      "slug": "village-function-catering-business-ideas"
    },
    {
      "id": "C009-S09",
      "name": "Town Two Wheeler Workshop Business Ideas",
      "slug": "town-two-wheeler-workshop-business-ideas"
    },
    {
      "id": "C009-S10",
      "name": "Small Town Passenger Transport Business Ideas",
      "slug": "small-town-passenger-transport-business-ideas"
    }
  ]
};

export const EXPANSION_CATEGORY_NAMES: Record<string, string> = {
  "work-from-home-business-ideas": "Work From Home Business Ideas",
  "local-service-business-ideas": "Local Service Business Ideas",
  "skill-based-business-ideas": "Skill Based Business Ideas",
  "freelance-business-ideas": "Freelance Business Ideas",
  "reselling-business-ideas": "Reselling Business Ideas",
  "childcare-and-parenting-support-business-ideas": "Childcare and Parenting Support Business Ideas",
  "printing-and-signage-business-ideas": "Printing and Signage Business Ideas",
  "food-business-ideas": "Food Business Ideas",
  "home-kitchen-food-business-ideas": "Home Kitchen Food Business Ideas",
  "street-food-business-ideas": "Street Food Business Ideas",
  "bakery-and-confectionery-business-ideas": "Bakery and Confectionery Business Ideas",
  "side-hustle-business-ideas": "Side Hustle Business Ideas",
  "catering-business-ideas": "Catering Business Ideas",
  "cloud-kitchen-business-ideas": "Cloud Kitchen Business Ideas",
  "packaged-snack-business-ideas": "Packaged Snack Business Ideas",
  "beverage-stall-and-drink-brand-business-ideas": "Beverage Stall and Drink Brand Business Ideas",
  "sweet-shop-and-mithai-business-ideas": "Sweet Shop and Mithai Business Ideas",
  "restaurant-and-eatery-business-ideas": "Restaurant and Eatery Business Ideas",
  "regional-specialty-food-business-ideas": "Regional Specialty Food Business Ideas",
  "beauty-business-ideas": "Beauty Business Ideas",
  "salon-and-grooming-business-ideas": "Salon and Grooming Business Ideas",
  "bridal-and-wedding-beauty-business-ideas": "Bridal and Wedding Beauty Business Ideas",
  "part-time-business-ideas": "Part Time Business Ideas",
  "fashion-and-apparel-business-ideas": "Fashion and Apparel Business Ideas",
  "tailoring-and-boutique-business-ideas": "Tailoring and Boutique Business Ideas",
  "jewellery-and-accessories-business-ideas": "Jewellery and Accessories Business Ideas",
  "footwear-and-bag-business-ideas": "Footwear and Bag Business Ideas",
  "handmade-product-business-ideas": "Handmade Product Business Ideas",
  "personal-care-product-business-ideas": "Personal Care Product Business Ideas",
  "home-textile-business-ideas": "Home Textile Business Ideas",
  "education-business-ideas": "Education Business Ideas",
  "tuition-and-coaching-business-ideas": "Tuition and Coaching Business Ideas",
  "competitive-exam-coaching-business-ideas": "Competitive Exam Coaching Business Ideas",
  "online-business-ideas": "Online Business Ideas",
  "digital-marketing-business-ideas": "Digital Marketing Business Ideas",
  "home-based-business-ideas": "Home Based Business Ideas",
  "e-commerce-selling-business-ideas": "E-commerce Selling Business Ideas",
  "affiliate-and-content-site-business-ideas": "Affiliate and Content Site Business Ideas",
  "women-friendly-business-ideas": "Women Friendly Business Ideas",
  "student-business-ideas": "Student Business Ideas",
  "senior-citizen-business-ideas": "Senior Citizen Business Ideas",
  "village-and-small-town-business-ideas": "Village and Small Town Business Ideas"
};

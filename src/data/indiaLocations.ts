// India location data with climate mapping

export interface District {
  name: string;
  climate: string;
}

export interface State {
  name: string;
  districts: District[];
}

export interface LocationData {
  country: string;
  states: State[];
}

// Climate types based on region
// tropical, subtropical, temperate, arid, semiarid

export const indiaLocationData: LocationData = {
  country: "India",
  states: [
    {
      name: "Andhra Pradesh",
      districts: [
        { name: "Visakhapatnam", climate: "tropical" },
        { name: "Vijayawada", climate: "tropical" },
        { name: "Guntur", climate: "tropical" },
        { name: "Tirupati", climate: "semiarid" },
        { name: "Kurnool", climate: "semiarid" },
        { name: "Anantapur", climate: "arid" },
        { name: "Nellore", climate: "tropical" },
        { name: "Kadapa", climate: "semiarid" },
      ],
    },
    {
      name: "Bihar",
      districts: [
        { name: "Patna", climate: "subtropical" },
        { name: "Gaya", climate: "subtropical" },
        { name: "Muzaffarpur", climate: "subtropical" },
        { name: "Bhagalpur", climate: "subtropical" },
        { name: "Darbhanga", climate: "subtropical" },
        { name: "Purnia", climate: "subtropical" },
        { name: "Nalanda", climate: "subtropical" },
        { name: "Vaishali", climate: "subtropical" },
      ],
    },
    {
      name: "Gujarat",
      districts: [
        { name: "Ahmedabad", climate: "semiarid" },
        { name: "Surat", climate: "tropical" },
        { name: "Vadodara", climate: "semiarid" },
        { name: "Rajkot", climate: "semiarid" },
        { name: "Kutch", climate: "arid" },
        { name: "Bhavnagar", climate: "semiarid" },
        { name: "Jamnagar", climate: "semiarid" },
        { name: "Junagadh", climate: "semiarid" },
      ],
    },
    {
      name: "Haryana",
      districts: [
        { name: "Gurugram", climate: "semiarid" },
        { name: "Faridabad", climate: "semiarid" },
        { name: "Hisar", climate: "semiarid" },
        { name: "Karnal", climate: "subtropical" },
        { name: "Panipat", climate: "semiarid" },
        { name: "Ambala", climate: "subtropical" },
        { name: "Rohtak", climate: "semiarid" },
        { name: "Sirsa", climate: "arid" },
      ],
    },
    {
      name: "Himachal Pradesh",
      districts: [
        { name: "Shimla", climate: "temperate" },
        { name: "Kullu", climate: "temperate" },
        { name: "Manali", climate: "temperate" },
        { name: "Dharamshala", climate: "temperate" },
        { name: "Solan", climate: "subtropical" },
        { name: "Mandi", climate: "temperate" },
        { name: "Kangra", climate: "subtropical" },
        { name: "Chamba", climate: "temperate" },
      ],
    },
    {
      name: "Jharkhand",
      districts: [
        { name: "Ranchi", climate: "subtropical" },
        { name: "Jamshedpur", climate: "subtropical" },
        { name: "Dhanbad", climate: "subtropical" },
        { name: "Bokaro", climate: "subtropical" },
        { name: "Hazaribagh", climate: "subtropical" },
        { name: "Deoghar", climate: "subtropical" },
        { name: "Giridih", climate: "subtropical" },
        { name: "Dumka", climate: "subtropical" },
      ],
    },
    {
      name: "Karnataka",
      districts: [
        { name: "Bengaluru", climate: "tropical" },
        { name: "Mysuru", climate: "tropical" },
        { name: "Mangaluru", climate: "tropical" },
        { name: "Hubli-Dharwad", climate: "semiarid" },
        { name: "Belagavi", climate: "semiarid" },
        { name: "Kalaburagi", climate: "semiarid" },
        { name: "Ballari", climate: "semiarid" },
        { name: "Udupi", climate: "tropical" },
      ],
    },
    {
      name: "Kerala",
      districts: [
        { name: "Thiruvananthapuram", climate: "tropical" },
        { name: "Kochi", climate: "tropical" },
        { name: "Kozhikode", climate: "tropical" },
        { name: "Thrissur", climate: "tropical" },
        { name: "Kannur", climate: "tropical" },
        { name: "Kollam", climate: "tropical" },
        { name: "Alappuzha", climate: "tropical" },
        { name: "Palakkad", climate: "tropical" },
      ],
    },
    {
      name: "Madhya Pradesh",
      districts: [
        { name: "Bhopal", climate: "subtropical" },
        { name: "Indore", climate: "subtropical" },
        { name: "Gwalior", climate: "semiarid" },
        { name: "Jabalpur", climate: "subtropical" },
        { name: "Ujjain", climate: "semiarid" },
        { name: "Sagar", climate: "subtropical" },
        { name: "Rewa", climate: "subtropical" },
        { name: "Satna", climate: "subtropical" },
      ],
    },
    {
      name: "Maharashtra",
      districts: [
        { name: "Mumbai", climate: "tropical" },
        { name: "Pune", climate: "semiarid" },
        { name: "Nagpur", climate: "subtropical" },
        { name: "Nashik", climate: "semiarid" },
        { name: "Aurangabad", climate: "semiarid" },
        { name: "Solapur", climate: "semiarid" },
        { name: "Kolhapur", climate: "tropical" },
        { name: "Amravati", climate: "semiarid" },
      ],
    },
    {
      name: "Odisha",
      districts: [
        { name: "Bhubaneswar", climate: "tropical" },
        { name: "Cuttack", climate: "tropical" },
        { name: "Puri", climate: "tropical" },
        { name: "Rourkela", climate: "subtropical" },
        { name: "Berhampur", climate: "tropical" },
        { name: "Sambalpur", climate: "subtropical" },
        { name: "Balasore", climate: "tropical" },
        { name: "Koraput", climate: "subtropical" },
      ],
    },
    {
      name: "Punjab",
      districts: [
        { name: "Ludhiana", climate: "subtropical" },
        { name: "Amritsar", climate: "semiarid" },
        { name: "Jalandhar", climate: "subtropical" },
        { name: "Patiala", climate: "subtropical" },
        { name: "Bathinda", climate: "semiarid" },
        { name: "Mohali", climate: "subtropical" },
        { name: "Hoshiarpur", climate: "subtropical" },
        { name: "Pathankot", climate: "subtropical" },
      ],
    },
    {
      name: "Rajasthan",
      districts: [
        { name: "Jaipur", climate: "semiarid" },
        { name: "Jodhpur", climate: "arid" },
        { name: "Udaipur", climate: "semiarid" },
        { name: "Kota", climate: "semiarid" },
        { name: "Bikaner", climate: "arid" },
        { name: "Ajmer", climate: "semiarid" },
        { name: "Jaisalmer", climate: "arid" },
        { name: "Alwar", climate: "semiarid" },
      ],
    },
    {
      name: "Tamil Nadu",
      districts: [
        { name: "Chennai", climate: "tropical" },
        { name: "Coimbatore", climate: "semiarid" },
        { name: "Madurai", climate: "semiarid" },
        { name: "Tiruchirappalli", climate: "semiarid" },
        { name: "Salem", climate: "semiarid" },
        { name: "Tirunelveli", climate: "tropical" },
        { name: "Erode", climate: "semiarid" },
        { name: "Thanjavur", climate: "tropical" },
      ],
    },
    {
      name: "Telangana",
      districts: [
        { name: "Hyderabad", climate: "semiarid" },
        { name: "Warangal", climate: "semiarid" },
        { name: "Nizamabad", climate: "semiarid" },
        { name: "Karimnagar", climate: "semiarid" },
        { name: "Khammam", climate: "tropical" },
        { name: "Nalgonda", climate: "semiarid" },
        { name: "Adilabad", climate: "subtropical" },
        { name: "Mahbubnagar", climate: "semiarid" },
      ],
    },
    {
      name: "Uttar Pradesh",
      districts: [
        { name: "Lucknow", climate: "subtropical" },
        { name: "Kanpur", climate: "subtropical" },
        { name: "Varanasi", climate: "subtropical" },
        { name: "Agra", climate: "semiarid" },
        { name: "Prayagraj", climate: "subtropical" },
        { name: "Meerut", climate: "subtropical" },
        { name: "Noida", climate: "subtropical" },
        { name: "Gorakhpur", climate: "subtropical" },
      ],
    },
    {
      name: "Uttarakhand",
      districts: [
        { name: "Dehradun", climate: "subtropical" },
        { name: "Haridwar", climate: "subtropical" },
        { name: "Nainital", climate: "temperate" },
        { name: "Rishikesh", climate: "subtropical" },
        { name: "Roorkee", climate: "subtropical" },
        { name: "Almora", climate: "temperate" },
        { name: "Pithoragarh", climate: "temperate" },
        { name: "Chamoli", climate: "temperate" },
      ],
    },
    {
      name: "West Bengal",
      districts: [
        { name: "Kolkata", climate: "tropical" },
        { name: "Howrah", climate: "tropical" },
        { name: "Darjeeling", climate: "temperate" },
        { name: "Siliguri", climate: "subtropical" },
        { name: "Durgapur", climate: "tropical" },
        { name: "Asansol", climate: "tropical" },
        { name: "Bardhaman", climate: "tropical" },
        { name: "Malda", climate: "tropical" },
      ],
    },
  ],
};

export const getClimateForDistrict = (stateName: string, districtName: string): string | null => {
  const state = indiaLocationData.states.find(s => s.name === stateName);
  if (!state) return null;
  
  const district = state.districts.find(d => d.name === districtName);
  return district?.climate || null;
};

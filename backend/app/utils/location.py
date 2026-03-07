# Pincode → city name, used by providers that need city name (e.g. 1mg)
PINCODE_TO_CITY: dict[str, str] = {
    "603203": "CHENNAI",
    "400001": "MUMBAI",
    "110001": "DELHI",
    "560001": "BANGALORE",
    "500001": "HYDERABAD",
    "700001": "KOLKATA",
    "411001": "PUNE",
    "380001": "AHMEDABAD",
    "302001": "JAIPUR",
    "395001": "SURAT",
    "226001": "LUCKNOW",
    "208001": "KANPUR",
    "440001": "NAGPUR",
    "452001": "INDORE",
    "462001": "BHOPAL",
    "800001": "PATNA",
    "641001": "COIMBATORE",
    "682001": "KOCHI",
}

DEFAULT_CITY = "CHENNAI"


def get_city(pincode: str) -> str:
    """
    Returns the city name for a given pincode.
    Falls back to Chennai for unknown pincodes.
    Used by providers like 1mg that need a city name rather than a pincode.
    """
    return PINCODE_TO_CITY.get(pincode.strip(), DEFAULT_CITY)
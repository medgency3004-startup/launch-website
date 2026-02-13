from dataclasses import dataclass
from typing import Optional

<<<<<<< HEAD

=======
>>>>>>> 0ff568fcb2993a8f7efeb3f9c6344b92dac8fd24
@dataclass
class Medicine:
    provider: str
    medicine_name: str
    available: bool
    mrp: Optional[float]
    price: Optional[float]
    url: Optional[str]

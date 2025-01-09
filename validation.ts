// Full Name Validation
export const validateFullName = (fullName: string): string | undefined => {
  const nameRegex = /^[A-Za-z\s]{3,40}$/;
  if (!fullName) return "Full name is required.";
  if (!nameRegex.test(fullName)) return "Full name must be 3-40 letters and contain only alphabetic characters.";
  return undefined;
};

// Email Validation
export const validateEmail = (email: string): string | undefined => {
  const emailRegex = /^[A-Za-z0-9._%+-]+@gmail\.com$/;
  if (!email) return "Email is required.";
  if (!emailRegex.test(email)) return "Email must be a valid gmail address (e.g., example@gmail.com).";
  return undefined;
};

// Phone Number Validation
export const validatePhoneNumber = (phone: string): string | undefined => {
  const phoneRegex = /^\d{10}$/;
  if (!phone) return "Phone number is required.";
  if (!phoneRegex.test(phone)) return "Phone number must be exactly 10 digits.";
  return undefined;
};

// Age Validation
export const validateAge = (age: string): string | undefined => {
  const ageNum = parseInt(age, 10);
  if (!age) return "Age is required.";
  if (isNaN(ageNum) || ageNum < 18 || ageNum > 65) return "Age must  between 18 and 65.";
  return undefined;
};

// Address Validation
export const validateAddress = (address: string): string | undefined => {
   const addressRegex = /^[A-Za-z0-9\s/#,.@-]{1,150}$/;
  if (!address) return "Address is required.";
  if (!addressRegex.test(address)) return "Address can contain letters, numbers, spaces, and /# up to 150 characters.";
  return undefined;
};

// Pincode Validation
export const validatePincode = (pincode: string): string | undefined => {
  const pincodeRegex = /^\d{6}$/;
  if (!pincode) return "Pincode is required.";
  if (!pincodeRegex.test(pincode)) return "Pincode must be exactly 6 digits.";
  return undefined;
};

// Password Validation
export const validatePassword = (password: string): string | undefined => {
  const passwordRegex = /^.{6,20}$/;
  if (!password) return "Password is required.";
  if (!passwordRegex.test(password)) return "Password must be 6-20 characters long and include letters, numbers, or symbols.";
  return undefined;
};



// validation for reset password

export const validatePasswords = (
  currentPassword: string,
  newPassword: string,
  confirmNewPassword: string
) => {
  if (!currentPassword || !newPassword || !confirmNewPassword) {
    return { valid: false, message: 'All fields are required.' };
  }
  if (newPassword !== confirmNewPassword) {
    return { valid: false, message: 'New passwords do not match.' };
  }
  if (newPassword.length < 6) {
    return { valid: false, message: 'New password must be at least 6 characters long.' };
  }
  if (newPassword === currentPassword) {
    return { valid: false, message: 'New password cannot be the same as the current password.' };
  }
  return { valid: true, message: '' };
};

//validation for services

export const validateServiceName = (serviceName: string): string | null => {
  if (!serviceName) return 'Service Name is required.';
  if (serviceName.length < 5 || serviceName.length > 100)
    return 'Service Name must be between 5 and 100 characters.';
  if (!/^[a-zA-Z0-9\s]+$/.test(serviceName))
    return 'Service Name must contain only alphanumeric characters.';
  return null;
};

export const validatePrice = (price: string): string | null => {
  if (!price) return 'Price is required.';
  if (!/^\d+$/.test(price)) return 'Price must be a valid numeric value.';
  const priceValue = parseInt(price, 10);
  if (priceValue < 50 || priceValue > 200000)
    return 'Price must be between ₹50 and ₹200,000.';
  return null;
};

export const validateDescription = (description: string): string | null => {
  if (!description) return 'Description is required.';
  if (description.length > 500)
    return 'Description must not exceed 500 characters.';
  return null;
};


//date formate 

export const formatDate = (date: string): string => {
  // Parse the date string into a Date object
  const parsedDate = new Date(date);
  console.log(parsedDate);

  if (isNaN(parsedDate.getTime())) {
    return "Invalid Date"; 
  }
  const day = String(parsedDate.getDate()).padStart(2, '0');
  const month = String(parsedDate.getMonth() + 1).padStart(2, '0'); 
  const year = parsedDate.getFullYear();
  return `${day}-${month}-${year}`;
};



//Generates the next 10 days in dd-mm-yyyy format.

export const generateNext10Days = (): string[] => {
  const today = new Date();
  return Array.from({ length: 10 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const day = ("0" + date.getDate()).slice(-2);
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  });
};


 //Defines hours in a 12-hour format.

export const defineHours12HourFormat = (): string[] => {
  return Array.from({ length: 18 }, (_, i) => {
    const hour = 6 + i;
    const amPm = hour >= 12 ? 'PM' : 'AM';
    const hourIn12Format = hour > 12 ? hour - 12 : hour;
    return `${hourIn12Format}:00 ${amPm} to ${hourIn12Format + 1}:00 ${amPm}`;
  });
};


export const generateTimeSlots = () => {
  const timeSlots = [];
  const startTime = 6; // 6 AM
  const endTime = 24; // 12 AM (midnight)
  const step = 1; // Interval in hours

  for (let hour = startTime; hour < endTime; hour += step) {
    const startPeriod = hour < 12 ? "AM" : "PM"; 
    const endPeriod = (hour + step) < 12 || (hour + step) === 24 ? "AM" : "PM"; 
    const startFormattedHour = hour % 12 === 0 ? 12 : hour % 12; 
    const endFormattedHour = (hour + step) % 12 === 0 ? 12 : (hour + step) % 12; 
    const timeSlot = `${startFormattedHour}:00 ${startPeriod} to ${endFormattedHour}:00 ${endPeriod}`;
    timeSlots.push(timeSlot);
  }

  return timeSlots;
};


// Format the ID as SRN001, SRN002, etc.
export const formatRequestId = (index) => {
  const number = index + 1;  // Increment index (starts from 0)
  return `SRN${number.toString().padStart(3, '0')}`; // Pad with leading zeros
};

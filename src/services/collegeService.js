/**
 * College Service - Mock API for college search and metadata
 * Replace with real API calls when backend is available
 */

// ============================================
// MOCK DATA
// ============================================
const MOCK_COLLEGES = [
    // ============================================
    // UTTAR PRADESH (50+ colleges)
    // ============================================
    { id: 'iit-kanpur', name: 'Indian Institute of Technology Kanpur', city: 'Kanpur', state: 'Uttar Pradesh' },
    { id: 'iit-bhu', name: 'Indian Institute of Technology (BHU) Varanasi', city: 'Varanasi', state: 'Uttar Pradesh' },
    { id: 'nit-allahabad', name: 'Motilal Nehru National Institute of Technology', city: 'Prayagraj', state: 'Uttar Pradesh' },
    { id: 'bhu', name: 'Banaras Hindu University', city: 'Varanasi', state: 'Uttar Pradesh' },
    { id: 'amu', name: 'Aligarh Muslim University', city: 'Aligarh', state: 'Uttar Pradesh' },
    { id: 'lucknow-univ', name: 'University of Lucknow', city: 'Lucknow', state: 'Uttar Pradesh' },
    { id: 'iiit-allahabad', name: 'Indian Institute of Information Technology Allahabad', city: 'Prayagraj', state: 'Uttar Pradesh' },
    { id: 'iim-lucknow', name: 'Indian Institute of Management Lucknow', city: 'Lucknow', state: 'Uttar Pradesh' },
    { id: 'amity-noida', name: 'Amity University Noida', city: 'Noida', state: 'Uttar Pradesh' },
    { id: 'shiv-nadar', name: 'Shiv Nadar University', city: 'Greater Noida', state: 'Uttar Pradesh' },
    { id: 'hbtu-kanpur', name: 'Harcourt Butler Technical University', city: 'Kanpur', state: 'Uttar Pradesh' },
    { id: 'aktu', name: 'Dr. A.P.J. Abdul Kalam Technical University', city: 'Lucknow', state: 'Uttar Pradesh' },
    { id: 'knit-sultanpur', name: 'Kamla Nehru Institute of Technology', city: 'Sultanpur', state: 'Uttar Pradesh' },
    { id: 'iet-lucknow', name: 'Institute of Engineering & Technology, Lucknow', city: 'Lucknow', state: 'Uttar Pradesh' },
    { id: 'bundelkhand-univ', name: 'Bundelkhand University', city: 'Jhansi', state: 'Uttar Pradesh' },
    { id: 'csjmu', name: 'Chhatrapati Shahu Ji Maharaj University', city: 'Kanpur', state: 'Uttar Pradesh' },
    { id: 'ddu-gorakhpur', name: 'Deen Dayal Upadhyaya Gorakhpur University', city: 'Gorakhpur', state: 'Uttar Pradesh' },
    { id: 'mjpru', name: 'Mahatma Jyotiba Phule Rohilkhand University', city: 'Bareilly', state: 'Uttar Pradesh' },
    { id: 'ccsu', name: 'Chaudhary Charan Singh University', city: 'Meerut', state: 'Uttar Pradesh' },
    { id: 'agra-univ', name: 'Dr. Bhimrao Ambedkar University', city: 'Agra', state: 'Uttar Pradesh' },
    { id: 'gla-mathura', name: 'GLA University', city: 'Mathura', state: 'Uttar Pradesh' },
    { id: 'srms-bareilly', name: 'Shri Ram Murti Smarak College of Engineering', city: 'Bareilly', state: 'Uttar Pradesh' },
    { id: 'bbau', name: 'Babasaheb Bhimrao Ambedkar University', city: 'Lucknow', state: 'Uttar Pradesh' },
    { id: 'allahabad-univ', name: 'University of Allahabad', city: 'Prayagraj', state: 'Uttar Pradesh' },
    { id: 'kgmu', name: 'King George Medical University', city: 'Lucknow', state: 'Uttar Pradesh' },
    { id: 'brd-medical', name: 'BRD Medical College', city: 'Gorakhpur', state: 'Uttar Pradesh' },
    { id: 'gsvm-kanpur', name: 'GSVM Medical College', city: 'Kanpur', state: 'Uttar Pradesh' },
    { id: 'llrm-medical', name: 'LLRM Medical College', city: 'Meerut', state: 'Uttar Pradesh' },
    { id: 'snmc-agra', name: 'SN Medical College', city: 'Agra', state: 'Uttar Pradesh' },
    { id: 'mlnmc-prayagraj', name: 'MLN Medical College', city: 'Prayagraj', state: 'Uttar Pradesh' },
    { id: 'bennett', name: 'Bennett University', city: 'Greater Noida', state: 'Uttar Pradesh' },
    { id: 'jiit-noida', name: 'Jaypee Institute of Information Technology', city: 'Noida', state: 'Uttar Pradesh' },
    { id: 'galgotias', name: 'Galgotias University', city: 'Greater Noida', state: 'Uttar Pradesh' },
    { id: 'glbitm', name: 'GL Bajaj Institute of Technology and Management', city: 'Greater Noida', state: 'Uttar Pradesh' },
    { id: 'kiet', name: 'KIET Group of Institutions', city: 'Ghaziabad', state: 'Uttar Pradesh' },
    { id: 'abes', name: 'ABES Engineering College', city: 'Ghaziabad', state: 'Uttar Pradesh' },
    { id: 'ims-noida', name: 'Institute of Management Studies Noida', city: 'Noida', state: 'Uttar Pradesh' },
    { id: 'ajay-kumar', name: 'Ajay Kumar Garg Engineering College', city: 'Ghaziabad', state: 'Uttar Pradesh' },
    { id: 'iftm-moradabad', name: 'IFTM University', city: 'Moradabad', state: 'Uttar Pradesh' },
    { id: 'invertis', name: 'Invertis University', city: 'Bareilly', state: 'Uttar Pradesh' },
    { id: 'srhu', name: 'Swami Rama Himalayan University', city: 'Dehradun', state: 'Uttar Pradesh' },
    { id: 'integral-univ', name: 'Integral University', city: 'Lucknow', state: 'Uttar Pradesh' },
    { id: 'rama-univ', name: 'Rama University', city: 'Kanpur', state: 'Uttar Pradesh' },
    { id: 'tmbu', name: 'Tilak Manjhi Bhagalpur University', city: 'Azamgarh', state: 'Uttar Pradesh' },
    { id: 'srmcem', name: 'SRM College of Engineering', city: 'Lucknow', state: 'Uttar Pradesh' },
    { id: 'rmlau', name: 'Dr. Ram Manohar Lohia Avadh University', city: 'Ayodhya', state: 'Uttar Pradesh' },
    { id: 'vbspu', name: 'Veer Bahadur Singh Purvanchal University', city: 'Jaunpur', state: 'Uttar Pradesh' },
    { id: 'madan-mohan', name: 'Madan Mohan Malaviya University of Technology', city: 'Gorakhpur', state: 'Uttar Pradesh' },
    { id: 'iec', name: 'IEC Group of Institutions', city: 'Greater Noida', state: 'Uttar Pradesh' },
    { id: 'sharda', name: 'Sharda University', city: 'Greater Noida', state: 'Uttar Pradesh' },
    { id: 'gbu-noida', name: 'Gautam Buddha University', city: 'Greater Noida', state: 'Uttar Pradesh' },
    { id: 'dei-agra', name: 'Dayalbagh Educational Institute', city: 'Agra', state: 'Uttar Pradesh' },
    { id: 'mgkvp-varanasi', name: 'Mahatma Gandhi Kashi Vidyapith', city: 'Varanasi', state: 'Uttar Pradesh' },
    { id: 'ssvv-varanasi', name: 'Sampurnanand Sanskrit Vishwavidyalaya', city: 'Varanasi', state: 'Uttar Pradesh' },
    { id: 'dsmru-lucknow', name: 'Dr. Shakuntala Misra National Rehabilitation University', city: 'Lucknow', state: 'Uttar Pradesh' },
    { id: 'prsu-prayagraj', name: 'Prof. Rajendra Singh (Rajju Bhaiya) University', city: 'Prayagraj', state: 'Uttar Pradesh' },
    { id: 'jncu-ballia', name: 'Jananayak Chandrashekhar University', city: 'Ballia', state: 'Uttar Pradesh' },
    { id: 'csauk-kanpur', name: 'Chandra Shekhar Azad University of Agriculture', city: 'Kanpur', state: 'Uttar Pradesh' },
    { id: 'anduat-ayodhya', name: 'Acharya Narendra Deva University of Agriculture', city: 'Ayodhya', state: 'Uttar Pradesh' },
    { id: 'svpuat-meerut', name: 'Sardar Vallabhbhai Patel University of Agriculture', city: 'Meerut', state: 'Uttar Pradesh' },
    { id: 'sgpgi-lucknow', name: 'Sanjay Gandhi Postgraduate Institute of Medical Sciences', city: 'Lucknow', state: 'Uttar Pradesh' },
    { id: 'rmlims-lucknow', name: 'Dr. Ram Manohar Lohia Institute of Medical Sciences', city: 'Lucknow', state: 'Uttar Pradesh' },
    { id: 'upums-saifai', name: 'Uttar Pradesh University of Medical Sciences', city: 'Saifai', state: 'Uttar Pradesh' },
    { id: 'santosh-ghaziabad', name: 'Santosh Deemed to be University', city: 'Ghaziabad', state: 'Uttar Pradesh' },
    { id: 'imsec-ghaziabad', name: 'IMS Engineering College', city: 'Ghaziabad', state: 'Uttar Pradesh' },
    { id: 'jssate-noida', name: 'JSS Academy of Technical Education', city: 'Noida', state: 'Uttar Pradesh' },
    { id: 'srmu-lucknow', name: 'Shri Ramswaroop Memorial University', city: 'Lucknow', state: 'Uttar Pradesh' },
    { id: 'bbdu-lucknow', name: 'Babu Banarasi Das University', city: 'Lucknow', state: 'Uttar Pradesh' },
    { id: 'mangalayatan-aligarh', name: 'Mangalayatan University', city: 'Aligarh', state: 'Uttar Pradesh' },
    { id: 'tmu-moradabad', name: 'Teerthanker Mahaveer University', city: 'Moradabad', state: 'Uttar Pradesh' },
    { id: 'era-lucknow', name: 'Era University', city: 'Lucknow', state: 'Uttar Pradesh' },
    { id: 'iimtu-meerut', name: 'IIMT University', city: 'Meerut', state: 'Uttar Pradesh' },
    { id: 'sanskriti-mathura', name: 'Sanskriti University', city: 'Mathura', state: 'Uttar Pradesh' },
    { id: 'shobhit-meerut', name: 'Shobhit University', city: 'Meerut', state: 'Uttar Pradesh' },
    { id: 'subharti-meerut', name: 'Swami Vivekanand Subharti University', city: 'Meerut', state: 'Uttar Pradesh' },
    { id: 'jauhar-rampur', name: 'Mohammad Ali Jauhar University', city: 'Rampur', state: 'Uttar Pradesh' },
    { id: 'biu-bareilly', name: 'Bareilly International University', city: 'Bareilly', state: 'Uttar Pradesh' },
    { id: 'niet-noida', name: 'Noida Institute of Engineering and Technology', city: 'Greater Noida', state: 'Uttar Pradesh' },
    { id: 'lloyd-noida', name: 'Lloyd Law College', city: 'Greater Noida', state: 'Uttar Pradesh' },
    { id: 'its-ghaziabad', name: 'ITS Engineering College', city: 'Ghaziabad', state: 'Uttar Pradesh' },

    // ============================================
    // DELHI (50+ colleges)
    // ============================================
    { id: 'iit-delhi', name: 'Indian Institute of Technology Delhi', city: 'New Delhi', state: 'Delhi' },
    { id: 'du', name: 'University of Delhi', city: 'New Delhi', state: 'Delhi' },
    { id: 'jnu', name: 'Jawaharlal Nehru University', city: 'New Delhi', state: 'Delhi' },
    { id: 'ipu', name: 'Guru Gobind Singh Indraprastha University', city: 'New Delhi', state: 'Delhi' },
    { id: 'iiit-delhi', name: 'Indraprastha Institute of Information Technology Delhi', city: 'New Delhi', state: 'Delhi' },
    { id: 'dtu', name: 'Delhi Technological University', city: 'New Delhi', state: 'Delhi' },
    { id: 'nsut', name: 'Netaji Subhas University of Technology', city: 'New Delhi', state: 'Delhi' },
    { id: 'igdtuw', name: 'Indira Gandhi Delhi Technical University for Women', city: 'New Delhi', state: 'Delhi' },
    { id: 'jamia', name: 'Jamia Millia Islamia', city: 'New Delhi', state: 'Delhi' },
    { id: 'aiims-delhi', name: 'All India Institute of Medical Sciences, Delhi', city: 'New Delhi', state: 'Delhi' },
    { id: 'nlu-delhi', name: 'National Law University, Delhi', city: 'New Delhi', state: 'Delhi' },
    { id: 'fms-delhi', name: 'Faculty of Management Studies, University of Delhi', city: 'New Delhi', state: 'Delhi' },
    { id: 'iift', name: 'Indian Institute of Foreign Trade', city: 'New Delhi', state: 'Delhi' },
    { id: 'srcc', name: 'Shri Ram College of Commerce', city: 'New Delhi', state: 'Delhi' },
    { id: 'hindu-college', name: 'Hindu College', city: 'New Delhi', state: 'Delhi' },
    { id: 'stephens', name: "St. Stephen's College", city: 'New Delhi', state: 'Delhi' },
    { id: 'lsr', name: 'Lady Shri Ram College for Women', city: 'New Delhi', state: 'Delhi' },
    { id: 'hansraj', name: 'Hansraj College', city: 'New Delhi', state: 'Delhi' },
    { id: 'miranda', name: 'Miranda House', city: 'New Delhi', state: 'Delhi' },
    { id: 'ramjas', name: 'Ramjas College', city: 'New Delhi', state: 'Delhi' },
    { id: 'kmc', name: 'Kirori Mal College', city: 'New Delhi', state: 'Delhi' },
    { id: 'venky', name: 'Sri Venkateswara College', city: 'New Delhi', state: 'Delhi' },
    { id: 'ip-college', name: 'Indraprastha College for Women', city: 'New Delhi', state: 'Delhi' },
    { id: 'gargi', name: 'Gargi College', city: 'New Delhi', state: 'Delhi' },
    { id: 'dyal-singh', name: 'Dyal Singh College', city: 'New Delhi', state: 'Delhi' },
    { id: 'pgdav', name: 'PGDAV College', city: 'New Delhi', state: 'Delhi' },
    { id: 'dcac', name: 'Delhi College of Arts and Commerce', city: 'New Delhi', state: 'Delhi' },
    { id: 'arsd', name: 'Atma Ram Sanatan Dharma College', city: 'New Delhi', state: 'Delhi' },
    { id: 'bharati-college', name: 'Bharati College', city: 'New Delhi', state: 'Delhi' },
    { id: 'deshbandhu', name: 'Deshbandhu College', city: 'New Delhi', state: 'Delhi' },
    { id: 'maitreyi', name: 'Maitreyi College', city: 'New Delhi', state: 'Delhi' },
    { id: 'aryabhatta', name: 'Aryabhatta College', city: 'New Delhi', state: 'Delhi' },
    { id: 'satyawati', name: 'Satyawati College', city: 'New Delhi', state: 'Delhi' },
    { id: 'shaheed-bhagat', name: 'Shaheed Bhagat Singh College', city: 'New Delhi', state: 'Delhi' },
    { id: 'cvs', name: 'College of Vocational Studies', city: 'New Delhi', state: 'Delhi' },
    { id: 'jdm', name: 'Janki Devi Memorial College', city: 'New Delhi', state: 'Delhi' },
    { id: 'keshav-mahavidyalaya', name: 'Keshav Mahavidyalaya', city: 'New Delhi', state: 'Delhi' },
    { id: 'lbsnaa', name: 'Lakshmibai College', city: 'New Delhi', state: 'Delhi' },
    { id: 'mhc', name: 'Maharaja Agrasen College', city: 'New Delhi', state: 'Delhi' },
    { id: 'motilal-nehru', name: 'Motilal Nehru College', city: 'New Delhi', state: 'Delhi' },
    { id: 'rajdhani', name: 'Rajdhani College', city: 'New Delhi', state: 'Delhi' },
    { id: 'ram-lal-anand', name: 'Ram Lal Anand College', city: 'New Delhi', state: 'Delhi' },
    { id: 'sgnd-khalsa', name: 'Sri Guru Nanak Dev Khalsa College', city: 'New Delhi', state: 'Delhi' },
    { id: 'sgtb-khalsa', name: 'Sri Guru Tegh Bahadur Khalsa College', city: 'New Delhi', state: 'Delhi' },
    { id: 'zakir-husain', name: 'Zakir Husain Delhi College', city: 'New Delhi', state: 'Delhi' },
    { id: 'iim-delhi', name: 'IIM Delhi (ISB)', city: 'New Delhi', state: 'Delhi' },
    { id: 'nift-delhi', name: 'National Institute of Fashion Technology Delhi', city: 'New Delhi', state: 'Delhi' },
    { id: 'nid-delhi', name: 'National Institute of Design Delhi', city: 'New Delhi', state: 'Delhi' },
    { id: 'iilm', name: 'IILM University', city: 'New Delhi', state: 'Delhi' },
    { id: 'bvp', name: 'Bharati Vidyapeeth Delhi', city: 'New Delhi', state: 'Delhi' },
    { id: 'mamc', name: 'Maulana Azad Medical College', city: 'New Delhi', state: 'Delhi' },
    { id: 'ucms', name: 'University College of Medical Sciences', city: 'New Delhi', state: 'Delhi' },
    { id: 'vmmc', name: 'Vardhman Mahavir Medical College', city: 'New Delhi', state: 'Delhi' },
    { id: 'lhmc', name: 'Lady Hardinge Medical College', city: 'New Delhi', state: 'Delhi' },

    // ============================================
    // MAHARASHTRA (50+ colleges)
    // ============================================
    { id: 'iit-bombay', name: 'Indian Institute of Technology Bombay', city: 'Mumbai', state: 'Maharashtra' },
    { id: 'mu', name: 'University of Mumbai', city: 'Mumbai', state: 'Maharashtra' },
    { id: 'sppu', name: 'Savitribai Phule Pune University', city: 'Pune', state: 'Maharashtra' },
    { id: 'nit-nagpur', name: 'Visvesvaraya National Institute of Technology', city: 'Nagpur', state: 'Maharashtra' },
    { id: 'coep', name: 'College of Engineering Pune', city: 'Pune', state: 'Maharashtra' },
    { id: 'vjti', name: 'Veermata Jijabai Technological Institute', city: 'Mumbai', state: 'Maharashtra' },
    { id: 'ict-mumbai', name: 'Institute of Chemical Technology', city: 'Mumbai', state: 'Maharashtra' },
    { id: 'nmims', name: 'NMIMS University', city: 'Mumbai', state: 'Maharashtra' },
    { id: 'symbiosis', name: 'Symbiosis International University', city: 'Pune', state: 'Maharashtra' },
    { id: 'tiss', name: 'Tata Institute of Social Sciences', city: 'Mumbai', state: 'Maharashtra' },
    { id: 'iim-mumbai', name: 'IIM Mumbai (Jamnalal Bajaj)', city: 'Mumbai', state: 'Maharashtra' },
    { id: 'sp-jain', name: 'SP Jain Institute of Management and Research', city: 'Mumbai', state: 'Maharashtra' },
    { id: 'afmc-pune', name: 'Armed Forces Medical College', city: 'Pune', state: 'Maharashtra' },
    { id: 'kj-somaiya', name: 'KJ Somaiya College of Engineering', city: 'Mumbai', state: 'Maharashtra' },
    { id: 'dj-sanghvi', name: 'DJ Sanghvi College of Engineering', city: 'Mumbai', state: 'Maharashtra' },
    { id: 'spit', name: 'Sardar Patel Institute of Technology', city: 'Mumbai', state: 'Maharashtra' },
    { id: 'tcet', name: 'Thakur College of Engineering and Technology', city: 'Mumbai', state: 'Maharashtra' },
    { id: 'vesit', name: 'Vivekanand Education Society Institute of Technology', city: 'Mumbai', state: 'Maharashtra' },
    { id: 'tsec', name: 'Thadomal Shahani Engineering College', city: 'Mumbai', state: 'Maharashtra' },
    { id: 'fr-crit', name: 'Fr. Conceicao Rodrigues Institute of Technology', city: 'Mumbai', state: 'Maharashtra' },
    { id: 'rait', name: 'Ramrao Adik Institute of Technology', city: 'Navi Mumbai', state: 'Maharashtra' },
    { id: 'sies', name: 'SIES Graduate School of Technology', city: 'Navi Mumbai', state: 'Maharashtra' },
    { id: 'pillai', name: 'Pillai College of Engineering', city: 'Navi Mumbai', state: 'Maharashtra' },
    { id: 'pvg-coet', name: 'PVG College of Engineering and Technology', city: 'Pune', state: 'Maharashtra' },
    { id: 'scoe-pune', name: 'Sinhgad College of Engineering', city: 'Pune', state: 'Maharashtra' },
    { id: 'pict', name: 'Pune Institute of Computer Technology', city: 'Pune', state: 'Maharashtra' },
    { id: 'mit-pune', name: 'Maharashtra Institute of Technology', city: 'Pune', state: 'Maharashtra' },
    { id: 'viit', name: 'Vishwakarma Institute of Information Technology', city: 'Pune', state: 'Maharashtra' },
    { id: 'vit-pune', name: 'Vishwakarma Institute of Technology', city: 'Pune', state: 'Maharashtra' },
    { id: 'dypatil-pune', name: 'DY Patil College of Engineering', city: 'Pune', state: 'Maharashtra' },
    { id: 'jspm', name: 'JSPM Narhe Technical Campus', city: 'Pune', state: 'Maharashtra' },
    { id: 'rcoem', name: 'Ramdeobaba College of Engineering', city: 'Nagpur', state: 'Maharashtra' },
    { id: 'ycce', name: 'Yeshwantrao Chavan College of Engineering', city: 'Nagpur', state: 'Maharashtra' },
    { id: 'gcoe-nagpur', name: 'Government College of Engineering Nagpur', city: 'Nagpur', state: 'Maharashtra' },
    { id: 'gcoea', name: 'Government College of Engineering Amravati', city: 'Amravati', state: 'Maharashtra' },
    { id: 'geca', name: 'Government Engineering College Aurangabad', city: 'Aurangabad', state: 'Maharashtra' },
    { id: 'walchand-sangli', name: 'Walchand College of Engineering', city: 'Sangli', state: 'Maharashtra' },
    { id: 'sit-lonavala', name: 'Symbiosis Institute of Technology', city: 'Pune', state: 'Maharashtra' },
    { id: 'mit-adt', name: 'MIT ADT University', city: 'Pune', state: 'Maharashtra' },
    { id: 'xaviers-mumbai', name: "St. Xavier's College", city: 'Mumbai', state: 'Maharashtra' },
    { id: 'elphinstone', name: 'Elphinstone College', city: 'Mumbai', state: 'Maharashtra' },
    { id: 'ruparel', name: 'Ramnarain Ruia Autonomous College', city: 'Mumbai', state: 'Maharashtra' },
    { id: 'hr-mumbai', name: 'HR College of Commerce and Economics', city: 'Mumbai', state: 'Maharashtra' },
    { id: 'narsee-monjee', name: 'Narsee Monjee College of Commerce', city: 'Mumbai', state: 'Maharashtra' },
    { id: 'mit-wpu', name: 'MIT World Peace University', city: 'Pune', state: 'Maharashtra' },
    { id: 'flame', name: 'FLAME University', city: 'Pune', state: 'Maharashtra' },
    { id: 'fergusson', name: 'Fergusson College', city: 'Pune', state: 'Maharashtra' },
    { id: 'bmcc', name: 'BMCC Pune', city: 'Pune', state: 'Maharashtra' },
    { id: 'seth-gs', name: 'Seth GS Medical College', city: 'Mumbai', state: 'Maharashtra' },
    { id: 'ltm-medical', name: 'Lokmanya Tilak Medical College', city: 'Mumbai', state: 'Maharashtra' },
    { id: 'grant-medical', name: 'Grant Medical College', city: 'Mumbai', state: 'Maharashtra' },
    { id: 'bj-medical', name: 'BJ Government Medical College', city: 'Pune', state: 'Maharashtra' },
    { id: 'gnlu-mumbai', name: 'Government Law College Mumbai', city: 'Mumbai', state: 'Maharashtra' },
    { id: 'ils-pune', name: 'ILS Law College', city: 'Pune', state: 'Maharashtra' },

    // ============================================
    // OTHER MAJOR STATES (keeping some for diversity)
    // ============================================
    { id: 'iit-madras', name: 'Indian Institute of Technology Madras', city: 'Chennai', state: 'Tamil Nadu' },
    { id: 'iit-kharagpur', name: 'Indian Institute of Technology Kharagpur', city: 'Kharagpur', state: 'West Bengal' },
    { id: 'iit-roorkee', name: 'Indian Institute of Technology Roorkee', city: 'Roorkee', state: 'Uttarakhand' },
    { id: 'iit-guwahati', name: 'Indian Institute of Technology Guwahati', city: 'Guwahati', state: 'Assam' },
    { id: 'iit-hyderabad', name: 'Indian Institute of Technology Hyderabad', city: 'Hyderabad', state: 'Telangana' },
    { id: 'bits-pilani', name: 'Birla Institute of Technology and Science, Pilani', city: 'Pilani', state: 'Rajasthan' },
    { id: 'nit-trichy', name: 'National Institute of Technology Tiruchirappalli', city: 'Tiruchirappalli', state: 'Tamil Nadu' },
    { id: 'nit-surathkal', name: 'National Institute of Technology Karnataka', city: 'Surathkal', state: 'Karnataka' },
    { id: 'vit-vellore', name: 'Vellore Institute of Technology', city: 'Vellore', state: 'Tamil Nadu' },
    { id: 'manipal', name: 'Manipal Institute of Technology', city: 'Manipal', state: 'Karnataka' },
    { id: 'iiit-hyderabad', name: 'International Institute of Information Technology Hyderabad', city: 'Hyderabad', state: 'Telangana' },
    { id: 'iim-ahmedabad', name: 'Indian Institute of Management Ahmedabad', city: 'Ahmedabad', state: 'Gujarat' },
    { id: 'iim-bangalore', name: 'Indian Institute of Management Bangalore', city: 'Bangalore', state: 'Karnataka' },
    { id: 'iim-calcutta', name: 'Indian Institute of Management Calcutta', city: 'Kolkata', state: 'West Bengal' },
];

const MOCK_COLLEGE_META = {
    'iit-delhi': {
        degrees: [
            { id: 'btech', name: 'B.Tech', duration: 4 },
            { id: 'mtech', name: 'M.Tech', duration: 2 },
            { id: 'phd', name: 'Ph.D', duration: 5 },
        ],
        branches: {
            'btech': [
                { id: 'cse', name: 'Computer Science & Engineering' },
                { id: 'ece', name: 'Electronics & Communication' },
                { id: 'ee', name: 'Electrical Engineering' },
                { id: 'me', name: 'Mechanical Engineering' },
                { id: 'ce', name: 'Civil Engineering' },
            ],
            'mtech': [
                { id: 'cse', name: 'Computer Science' },
                { id: 'ai', name: 'Artificial Intelligence' },
                { id: 'vlsi', name: 'VLSI Design' },
            ],
            'phd': [
                { id: 'research', name: 'Research Program' },
            ],
        }
    },
    // Default meta for colleges without specific data
    '_default': {
        degrees: [
            { id: 'btech', name: 'B.Tech', duration: 4 },
            { id: 'be', name: 'B.E.', duration: 4 },
            { id: 'bsc', name: 'B.Sc', duration: 3 },
            { id: 'bcom', name: 'B.Com', duration: 3 },
            { id: 'ba', name: 'B.A.', duration: 3 },
            { id: 'mtech', name: 'M.Tech', duration: 2 },
            { id: 'mba', name: 'MBA', duration: 2 },
            { id: 'msc', name: 'M.Sc', duration: 2 },
        ],
        branches: {
            'btech': [
                { id: 'cse', name: 'Computer Science & Engineering' },
                { id: 'ece', name: 'Electronics & Communication' },
                { id: 'ee', name: 'Electrical Engineering' },
                { id: 'me', name: 'Mechanical Engineering' },
                { id: 'ce', name: 'Civil Engineering' },
                { id: 'it', name: 'Information Technology' },
            ],
            'be': [
                { id: 'cse', name: 'Computer Science' },
                { id: 'ece', name: 'Electronics' },
                { id: 'me', name: 'Mechanical' },
            ],
            'bsc': [
                { id: 'physics', name: 'Physics' },
                { id: 'chemistry', name: 'Chemistry' },
                { id: 'maths', name: 'Mathematics' },
                { id: 'cs', name: 'Computer Science' },
            ],
            'bcom': [
                { id: 'general', name: 'General' },
                { id: 'honors', name: 'Honours' },
                { id: 'accounting', name: 'Accounting & Finance' },
            ],
            'ba': [
                { id: 'english', name: 'English' },
                { id: 'history', name: 'History' },
                { id: 'economics', name: 'Economics' },
                { id: 'psychology', name: 'Psychology' },
            ],
            'mtech': [
                { id: 'cse', name: 'Computer Science' },
                { id: 'ai', name: 'Artificial Intelligence' },
            ],
            'mba': [
                { id: 'general', name: 'General Management' },
                { id: 'finance', name: 'Finance' },
                { id: 'marketing', name: 'Marketing' },
                { id: 'hr', name: 'Human Resources' },
            ],
            'msc': [
                { id: 'physics', name: 'Physics' },
                { id: 'chemistry', name: 'Chemistry' },
                { id: 'maths', name: 'Mathematics' },
            ],
        }
    }
};

// ============================================
// SESSION CACHE
// ============================================
const searchCache = new Map();

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Simple fuzzy match scoring
 */
function fuzzyMatch(text, query) {
    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase();

    // Exact match = highest score
    if (lowerText === lowerQuery) return 100;

    // Starts with = high score
    if (lowerText.startsWith(lowerQuery)) return 90;

    // Contains = medium score
    if (lowerText.includes(lowerQuery)) return 70;

    // Word match = medium score
    const words = lowerText.split(/\s+/);
    for (const word of words) {
        if (word.startsWith(lowerQuery)) return 60;
    }

    // Trigram similarity (simplified)
    let matches = 0;
    for (let i = 0; i < lowerQuery.length - 2; i++) {
        const trigram = lowerQuery.substring(i, i + 3);
        if (lowerText.includes(trigram)) matches++;
    }
    const trigramScore = (matches / Math.max(1, lowerQuery.length - 2)) * 50;

    return trigramScore;
}

/**
 * Create a debounced function
 */
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ============================================
// API FUNCTIONS
// ============================================

/**
 * Search colleges with fuzzy matching
 * @param {string} query - Search query (min 2 chars)
 * @param {number} maxResults - Maximum results to return
 * @returns {Promise<Array<{id, name, city, state}>>}
 */
export async function searchColleges(query, maxResults = 6) {
    // Check cache first
    const cacheKey = query.toLowerCase().trim();
    if (searchCache.has(cacheKey)) {
        return searchCache.get(cacheKey);
    }

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 150 + Math.random() * 100));

    if (!query || query.length < 2) {
        return [];
    }

    // Score and filter colleges
    const scored = MOCK_COLLEGES
        .map(college => ({
            ...college,
            score: Math.max(
                fuzzyMatch(college.name, query),
                fuzzyMatch(college.city, query) * 0.5,
                fuzzyMatch(college.state, query) * 0.3
            )
        }))
        .filter(c => c.score > 20)
        .sort((a, b) => b.score - a.score)
        .slice(0, maxResults)
        .map(({ score, ...college }) => college); // Remove score from result

    // Cache result
    searchCache.set(cacheKey, scored);

    return scored;
}

/**
 * Get college metadata (degrees, branches)
 * @param {string} collegeId - College ID
 * @returns {Promise<{degrees: Array, branches: Object}>}
 */
export async function getCollegeMeta(collegeId) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 100));

    // Return specific meta if available, otherwise default
    return MOCK_COLLEGE_META[collegeId] || MOCK_COLLEGE_META['_default'];
}

/**
 * Get year options based on degree duration
 * @param {number} duration - Degree duration in years
 * @returns {Array<{value, label}>}
 */
export function getYearOptions(duration) {
    const ordinals = ['1st', '2nd', '3rd', '4th', '5th', '6th'];
    return Array.from({ length: duration }, (_, i) => ({
        value: String(i + 1),
        label: `${ordinals[i]} Year`
    }));
}

/**
 * Get semester options based on year
 * @param {number} year - Current year (1-indexed)
 * @returns {Array<{value, label}>}
 */
export function getSemesterOptions(year) {
    const semStart = (year - 1) * 2 + 1;
    return [
        { value: String(semStart), label: `${semStart}${getOrdinalSuffix(semStart)} Semester` },
        { value: String(semStart + 1), label: `${semStart + 1}${getOrdinalSuffix(semStart + 1)} Semester` }
    ];
}

export function getOrdinalSuffix(n) {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return s[(v - 20) % 10] || s[v] || s[0];
}

// ============================================
// TELEMETRY (Stub)
// ============================================

/**
 * Emit telemetry event (stub - replace with real implementation)
 */
export function emitTelemetry(eventName, data) {
    if (process.env.NODE_ENV === 'development') {
        console.log(`[Telemetry] ${eventName}`, data);
    }
    // TODO: Replace with actual telemetry service
    // analytics.track(eventName, data);
}

export default {
    searchColleges,
    getCollegeMeta,
    getYearOptions,
    getSemesterOptions,
    debounce,
    emitTelemetry
};

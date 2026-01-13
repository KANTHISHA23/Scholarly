import React from 'react';

const Filters = ({ setLoc, setSubCat, setSchCat }) => {
  return (
    <div className='flex flex-wrap justify-center gap-4'>
      {/* Scholarship Category Filter */}
      <div>
        <select
          onChange={(e) => setSchCat(e.target.value)}
          defaultValue=''
          className='select select-bordered focus:outline-none focus:border-primary'
        >
          <option value='' disabled>
            Scholarship Category
          </option>
          <option value=''>All</option>
          <option value='Government'>Government (NSP/State)</option>
          <option value='Corporate CSR'>Corporate CSR</option>
          <option value='Institutional'>Institutional</option>
          <option value='NGO'>NGO/Trust</option>
        </select>
      </div>

      {/* Subject Category Filter */}
      <div>
        <select
          onChange={(e) => setSubCat(e.target.value)}
          defaultValue=''
          className='select select-bordered focus:outline-none focus:border-primary'
        >
          <option value='' disabled>
            Subject Specializations
          </option>
          <option value=''>All</option>
          <option value='Computer Science & IT'>Computer Science & IT</option>
          <option value='Electronics & Communication'>
            Electronics & Communication
          </option>
          <option value='Mechanical & Civil'>Mechanical & Civil</option>
          <option value='Electrical & Instrumentation'>
            Electrical & Instrumentation
          </option>
          <option value='Emerging Tech (AI/ML/Data Science)'>
            Emerging Tech (AI/ML/Data Science)
          </option>
          <option value='Core Engineering (Chemical/Metallurgy)'>
            Core Engineering (Chemical/Metallurgy)
          </option>
        </select>
      </div>

      {/* State Filter */}
      <div>
        <select
          onChange={(e) => setLoc(e.target.value)}
          defaultValue=''
          className='select select-bordered focus:outline-none focus:border-primary'
        >
          <option value='' disabled>
            State
          </option>
          <option value=''>All</option>
          <option value='Andhra Pradesh'>Andhra Pradesh</option>
          <option value='Arunachal Pradesh'>Arunachal Pradesh</option>
          <option value='Assam'>Assam</option>
          <option value='Bihar'>Bihar</option>
          <option value='Chhattisgarh'>Chhattisgarh</option>
          <option value='Goa'>Goa</option>
          <option value='Gujarat'>Gujarat</option>
          <option value='Haryana'>Haryana</option>
          <option value='Himachal Pradesh'>Himachal Pradesh</option>
          <option value='Jharkhand'>Jharkhand</option>
          <option value='Karnataka'>Karnataka</option>
          <option value='Kerala'>Kerala</option>
          <option value='Madhya Pradesh'>Madhya Pradesh</option>
          <option value='Maharashtra'>Maharashtra</option>
          <option value='Manipur'>Manipur</option>
          <option value='Meghalaya'>Meghalaya</option>
          <option value='Mizoram'>Mizoram</option>
          <option value='Nagaland'>Nagaland</option>
          <option value='Odisha'>Odisha</option>
          <option value='Punjab'>Punjab</option>
          <option value='Rajasthan'>Rajasthan</option>
          <option value='Sikkim'>Sikkim</option>
          <option value='Tamil Nadu'>Tamil Nadu</option>
          <option value='Telangana'>Telangana</option>
          <option value='Tripura'>Tripura</option>
          <option value='Uttar Pradesh'>Uttar Pradesh</option>
          <option value='Uttarakhand'>Uttarakhand</option>
          <option value='West Bengal'>West Bengal</option>
          <option value='Andaman and Nicobar Islands'>
            Andaman and Nicobar Islands
          </option>
          <option value='Chandigarh'>Chandigarh</option>
          <option value='Dadra and Nagar Haveli and Daman and Diu'>
            Dadra and Nagar Haveli and Daman and Diu
          </option>
          <option value='Delhi'>Delhi</option>
          <option value='Jammu and Kashmir'>Jammu and Kashmir</option>
          <option value='Ladakh'>Ladakh</option>
          <option value='Lakshadweep'>Lakshadweep</option>
          <option value='Puducherry'>Puducherry</option>
        </select>
      </div>

    </div>
  );
};

export default Filters;

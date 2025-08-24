import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search } from 'lucide-react';
import { gsap } from 'gsap';
import { useNavigate } from 'react-router-dom';
import { getData } from '../utils/http';

const BRAND_ALIAS_MAP = {
    // normalize → canonical
    'amron': 'Amaron',
    'amaron': 'Amaron',

    'excide': 'Exide',
    'exide': 'Exide',

    'sf sonic': 'SF Batteries',
    'sf batteries': 'SF Batteries',

    'dynax': 'Dynex',
    'dynex': 'Dynex',

    'livguard': 'Livfast', // you wrote "livegurard", closest in your list is Livfast
    'livgurard': 'Livfast',
    'livegurard': 'Livfast',
    'livfast': 'Livfast',

    'microtk': 'Microtek',
    'microke': 'Microtek',
    'microtek': 'Microtek',

    'luminous': 'Luminous',
    'apc': 'APC',
    'vikram': 'Vikram',
    'warree': 'Warree',
    'usha shriram': 'Usha Shriram',
    'bi cell': 'Bi Cell',
    'su-vastika': 'Su-vastika',
    'adani': 'Adani',
};

const PRODUCT_LINE_TO_BRANDS = {
    // Keys must match Product Line names returned by your API exactly
    '2 Wheeler Batteries': ['Amaron', 'Exide', 'SF Batteries'],
    'Four Wheeler Batteries': ['Amaron', 'Dynex', 'Exide', 'Livfast', 'SF Batteries'],
    'Truck Batteries': ['Amaron', 'Dynex', 'Exide'],
    'Genset Batteries': ['Exide'],
    'Inverter & Battery Combo': ['Amaron', 'Exide', 'Luminous', 'Microtek'],
    'Inverter & UPS System': ['Amaron', 'Exide', 'Luminous', 'Microtek'],
    'Inverter Batteries': ['Amaron', 'Exide', 'Livfast', 'Luminous', 'Microtek', 'SF Batteries'],
    'SMF/VRLA Batteries': ['Amaron', 'Exide'],
    'Solar Batteries': ['Exide', 'Luminous'],
    'Solar Energy Solutions': ['Luminous', 'Microtek'],
    'Solar Inverters': ['Luminous', 'Microtek'],
    'Computer UPS': ['Microtek', 'APC'],      // Added APC (common UPS brand) + your Microtek
    'Voltage Stabilizer': ['Microtek'],
};

const CAPACITY_OPTIONS = [
    { value: '0-50', label: '0 - 50 AH' },
    { value: '51-100', label: '51 - 100 AH' },
    { value: '101-150', label: '101 - 150 AH' },
    { value: '151-200', label: '151 - 200 AH' },
    { value: '200+', label: '200+ AH' },
];

const CITY_OPTIONS_BY_STATE = {
    Haryana: ['Gurugram'],
};

const ProductFinder = () => {
    const [productLines, setProductLines] = useState([]);
    const [allManufacturers, setAllManufacturers] = useState([]);
    const [vehicleModels, setVehicleModels] = useState([]);
    const [allBrands, setAllBrands] = useState([]);
    const [filteredBrands, setFilteredBrands] = useState([]);

    const [selectedProductLineId, setSelectedProductLineId] = useState('');
    const [selectedManufacturerId, setSelectedManufacturerId] = useState('');
    const [selectedVehicleModelId, setSelectedVehicleModelId] = useState('');
    const [selectedBrandId, setSelectedBrandId] = useState('');
    const [selectedCapacity, setSelectedCapacity] = useState('');
    const [selectedState, setSelectedState] = useState('');
    const [selectedCity, setSelectedCity] = useState('');

    const formRef = useRef(null);
    const navigate = useNavigate();

    const selectedProductLineName = useMemo(() => {
        return productLines.find(pl => pl._id === selectedProductLineId)?.name || '';
    }, [selectedProductLineId, productLines]);

    const shouldShowManufacturerAndModel = useMemo(() => {
        if (!selectedProductLineName) return false;
        return [
            '2 Wheeler Batteries',
            'Four Wheeler Batteries',
            'Truck Batteries',
        ].includes(selectedProductLineName);
    }, [selectedProductLineName]);

    const shouldShowCapacity = useMemo(() => {
        if (!selectedProductLineName) return false;
        const hideFor = [
            '2 Wheeler Batteries',
            'Four Wheeler Batteries',
            'Truck Batteries',
        ];
        return !hideFor.includes(selectedProductLineName);
    }, [selectedProductLineName]);

    const getCategoryFromProductLine = (productLineName) => {
        if (productLineName.includes('2 Wheeler')) return '2-wheeler';
        if (productLineName.includes('Four Wheeler')) return '4-wheeler';
        if (productLineName.includes('Truck')) return 'truck';
        return null;
    };

    const normalize = (str) => (str || '').toString().trim().toLowerCase();

    const getCanonicalBrandName = (brandName) => {
        const key = normalize(brandName);
        return BRAND_ALIAS_MAP[key] || brandName;
    };

    const getAllowedBrandNamesForProductLine = (productLineName) => {
        const allowed = PRODUCT_LINE_TO_BRANDS[productLineName] || [];
        // Map through alias again to ensure canonical forms
        return allowed.map(getCanonicalBrandName);
    };

    // Fetch product lines + all brands on mount
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [productLineRes, brandRes] = await Promise.all([
                    getData('/product-lines'),
                    getData('/brands?limit=1000&page=1'),
                ]);

                setProductLines(productLineRes.productLines || []);
                setAllBrands(brandRes.data || []);
            } catch (error) {
                console.error('Error fetching initial data:', error);
                setProductLines([]);
                setAllBrands([]);
            }
        };
        fetchInitialData();
    }, []);

    // Fetch manufacturers whenever product line changes
    useEffect(() => {
        const resetDownstream = () => {
            setSelectedManufacturerId('');
            setSelectedVehicleModelId('');
            setVehicleModels([]);
        };

        if (!selectedProductLineId) {
            setAllManufacturers([]);
            resetDownstream();
            return;
        }

        const category = getCategoryFromProductLine(selectedProductLineName);

        const fetchManufacturers = async () => {
            try {
                const res = await getData('/manufacturers');
                let list = res.manufacturers || [];
                if (category) {
                    list = list.filter(m => m.category === category);
                }
                setAllManufacturers(list);
            } catch (error) {
                console.error('Error fetching manufacturers:', error);
                setAllManufacturers([]);
            } finally {
                resetDownstream();
            }
        };

        fetchManufacturers();
    }, [selectedProductLineId, selectedProductLineName]);

    // Fetch vehicle models when manufacturer changes
    useEffect(() => {
        const fetchVehicleModels = async () => {
            try {
                const res = await getData(`/vehicle-models?manufacturer=${selectedManufacturerId}`);
                setVehicleModels(res.vehicleModels || []);
            } catch (error) {
                console.error('Error fetching vehicle models:', error);
                setVehicleModels([]);
            }
        };

        if (selectedManufacturerId) {
            fetchVehicleModels();
        } else {
            setVehicleModels([]);
            setSelectedVehicleModelId('');
        }
    }, [selectedManufacturerId]);

    // Compute filtered brands client-side based on your mapping
    useEffect(() => {
        if (!selectedProductLineName) {
            setFilteredBrands([]);
            setSelectedBrandId('');
            return;
        }

        const allowedBrandNames = new Set(
            getAllowedBrandNamesForProductLine(selectedProductLineName).map(normalize)
        );

        // convert allBrands to canonical names, then filter
        const matchingBrands = (allBrands || []).filter((brand) => {
            const canonicalName = getCanonicalBrandName(brand.name);
            return allowedBrandNames.has(normalize(canonicalName));
        });

        setFilteredBrands(matchingBrands);
        setSelectedBrandId('');
    }, [selectedProductLineName, allBrands]);

    // Reset city when state changes
    useEffect(() => {
        setSelectedCity('');
    }, [selectedState]);

    // Entry animation
    useEffect(() => {
        if (formRef.current) {
            gsap.fromTo(
                formRef.current,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
            );
        }
    }, []);

    const handleSearch = () => {
        const params = new URLSearchParams();

        if (selectedProductLineId) params.append('productLine', selectedProductLineId);
        if (shouldShowManufacturerAndModel && selectedManufacturerId) params.append('manufacturer', selectedManufacturerId);
        if (shouldShowManufacturerAndModel && selectedVehicleModelId) params.append('vehicleModel', selectedVehicleModelId);
        if (selectedBrandId) params.append('brand', selectedBrandId);
        if (shouldShowCapacity && selectedCapacity) params.append('capacityRange', selectedCapacity);
        if (selectedState) params.append('state', selectedState);
        if (selectedCity) params.append('city', selectedCity);

        params.append('page', '1');
        navigate(`/products?${params.toString()}`);
    };

    const resetAllFilters = () => {
        setSelectedProductLineId('');
        setSelectedManufacturerId('');
        setSelectedVehicleModelId('');
        setSelectedBrandId('');
        setSelectedCapacity('');
        setSelectedState('');
        setSelectedCity('');
    };

    return (
        <div className="bg-gray-100 py-8">
            <div className="container mx-auto px-4">
                <div ref={formRef} className="max-w-full mx-auto">
                    <div className="bg-white rounded-lg shadow-lg">
                        <div className="bg-green-600 p-6 text-white rounded-t-lg">
                            <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-2xl font-bold">Quick Product Finder</h3>
                            </div>
                            <p className="text-green-100">Find the perfect power solution for your needs</p>
                        </div>

                        <div className="p-6 space-y-4">
                            {/* Product Line */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">Select Product Line</label>
                                <select
                                    value={selectedProductLineId}
                                    onChange={(e) => setSelectedProductLineId(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                                >
                                    <option value="">Choose a Product Line</option>
                                    {productLines.map((productLine) => (
                                        <option key={productLine._id} value={productLine._id}>
                                            {productLine.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Manufacturer */}
                            {shouldShowManufacturerAndModel && (
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">Select Manufacturer</label>
                                    <select
                                        value={selectedManufacturerId}
                                        onChange={(e) => setSelectedManufacturerId(e.target.value)}
                                        disabled={allManufacturers.length === 0}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                                    >
                                        <option value="">
                                            {allManufacturers.length > 0 ? 'Choose a Manufacturer' : 'No Manufacturer Available'}
                                        </option>
                                        {allManufacturers.map((manufacturer) => (
                                            <option key={manufacturer._id} value={manufacturer._id}>
                                                {manufacturer.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* Vehicle Model */}
                            {shouldShowManufacturerAndModel && (
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">Select Vehicle Model</label>
                                    <select
                                        value={selectedVehicleModelId}
                                        onChange={(e) => setSelectedVehicleModelId(e.target.value)}
                                        disabled={vehicleModels.length === 0}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                                    >
                                        <option value="">{vehicleModels.length > 0 ? 'Choose a Vehicle Model' : 'No Model Available'}</option>
                                        {vehicleModels.map((vehicleModel) => (
                                            <option key={vehicleModel._id} value={vehicleModel._id}>
                                                {vehicleModel.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* Capacity */}
                            {shouldShowCapacity && (
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">Select Capacity (AH)</label>
                                    <select
                                        value={selectedCapacity}
                                        onChange={(e) => setSelectedCapacity(e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                                    >
                                        <option value="">Choose Capacity</option>
                                        {CAPACITY_OPTIONS.map((cap) => (
                                            <option key={cap.value} value={cap.value}>
                                                {cap.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* Brand (filtered via mapping) */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">Select Brand</label>
                                <select
                                    value={selectedBrandId}
                                    onChange={(e) => setSelectedBrandId(e.target.value)}
                                    disabled={filteredBrands.length === 0}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                                >
                                    <option value="">
                                        {selectedProductLineId
                                            ? (filteredBrands.length > 0 ? 'Choose a Brand' : 'No Brand Available for this Product Line')
                                            : 'Select a Product Line first'}
                                    </option>
                                    {filteredBrands.map((brand) => (
                                        <option key={brand._id} value={brand._id}>
                                            {brand.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* State */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">Select State</label>
                                <select
                                    value={selectedState}
                                    onChange={(e) => setSelectedState(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                                >
                                    <option value="">Choose a State</option>
                                    <option value="Haryana">Haryana</option>
                                </select>
                            </div>

                            {/* City */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">Select City</label>
                                <select
                                    value={selectedCity}
                                    onChange={(e) => setSelectedCity(e.target.value)}
                                    disabled={!selectedState}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                                >
                                    <option value="">{selectedState ? 'Choose a City' : 'Select a State first'}</option>
                                    {selectedState &&
                                        (CITY_OPTIONS_BY_STATE[selectedState] || []).map((city) => (
                                            <option key={city} value={city}>
                                                {city}
                                            </option>
                                        ))}
                                </select>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="p-6 bg-gray-50 rounded-b-lg">
                            <div className="flex gap-4">
                                <button
                                    onClick={resetAllFilters}
                                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-300"
                                >
                                    Reset
                                </button>
                                <button
                                    onClick={handleSearch}
                                    disabled={!selectedProductLineId}
                                    className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Search size={18} />
                                    Find Products
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductFinder;

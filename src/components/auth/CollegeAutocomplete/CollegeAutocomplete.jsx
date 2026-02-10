import { useState, useEffect, useRef, useCallback, useId } from 'react';
import { searchColleges, debounce, emitTelemetry } from '../../../services/collegeService';
import './CollegeAutocomplete.css';

const CollegeAutocomplete = ({
    value,
    selectedCollege,
    onSelect,
    onManualEntry,
    error,
    disabled = false
}) => {
    const [inputValue, setInputValue] = useState(value || '');
    const [results, setResults] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const [announcement, setAnnouncement] = useState('');

    const inputRef = useRef(null);
    const listRef = useRef(null);
    const searchStartTime = useRef(null);
    const uniqueId = useId();
    const listboxId = `college-listbox-${uniqueId}`;

    const debouncedSearch = useCallback(
        debounce(async (query) => {
            if (query.length < 2) {
                setResults([]);
                setIsOpen(false);
                setIsLoading(false);
                return;
            }

            searchStartTime.current = Date.now();

            try {
                const colleges = await searchColleges(query, 6);
                const duration = Date.now() - searchStartTime.current;

                setResults(colleges);
                setIsOpen(true);
                setActiveIndex(-1);

                if (colleges.length === 0) {
                    setAnnouncement('No colleges found. Try a different spelling or enter manually.');
                } else {
                    setAnnouncement(`${colleges.length} college${colleges.length !== 1 ? 's' : ''} found. Use arrow keys to navigate.`);
                }

                emitTelemetry('signup_college_search', {
                    query,
                    resultCount: colleges.length,
                    durationMs: duration
                });
            } catch (err) {
                console.error('College search failed:', err);
                setResults([]);
                setAnnouncement('Search failed. Please try again or enter manually.');
            } finally {
                setIsLoading(false);
            }
        }, 300),
        []
    );

    const handleInputChange = (e) => {
        const newValue = e.target.value;
        setInputValue(newValue);
        setIsLoading(newValue.length >= 2);

        if (selectedCollege) {
            onSelect(null, '');
        }

        debouncedSearch(newValue);
    };

    const handleSelect = (college) => {
        setInputValue(college.name);
        setIsOpen(false);
        setResults([]);
        setActiveIndex(-1);
        onSelect(college, college.name);

        emitTelemetry('college_selected', {
            collegeId: college.id,
            collegeName: college.name
        });
    };

    const handleManualEntry = () => {
        setIsOpen(false);
        onManualEntry(inputValue);

        emitTelemetry('manual_college_entered', {
            name: inputValue
        });
    };

    const handleKeyDown = (e) => {
        if (!isOpen) {
            if (e.key === 'ArrowDown' && results.length > 0) {
                setIsOpen(true);
                setActiveIndex(0);
                e.preventDefault();
            }
            return;
        }

        const totalItems = results.length + 1;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setActiveIndex((prev) => (prev + 1) % totalItems);
                break;
            case 'ArrowUp':
                e.preventDefault();
                setActiveIndex((prev) => (prev - 1 + totalItems) % totalItems);
                break;
            case 'Enter':
                e.preventDefault();
                if (activeIndex >= 0 && activeIndex < results.length) {
                    handleSelect(results[activeIndex]);
                } else if (activeIndex === results.length) {
                    handleManualEntry();
                }
                break;
            case 'Escape':
                e.preventDefault();
                setIsOpen(false);
                setActiveIndex(-1);
                inputRef.current?.focus();
                break;
            case 'Tab':
                setIsOpen(false);
                break;
            default:
                break;
        }
    };

    useEffect(() => {
        if (activeIndex >= 0 && listRef.current) {
            const activeElement = listRef.current.children[activeIndex];
            activeElement?.scrollIntoView({ block: 'nearest' });
        }
    }, [activeIndex]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (inputRef.current && !inputRef.current.contains(e.target) &&
                listRef.current && !listRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (value !== undefined && value !== inputValue) {
            setInputValue(value);
        }
    }, [value]);

    const getActiveDescendant = () => {
        if (activeIndex < 0) return undefined;
        if (activeIndex < results.length) {
            return `college-option-${results[activeIndex].id}`;
        }
        return 'manual-entry-option';
    };

    return (
        <div className="college-autocomplete">
            <div
                role="status"
                aria-live="polite"
                aria-atomic="true"
                className="sr-only"
            >
                {announcement}
            </div>

            <div className="autocomplete-input-wrapper">
                <input
                    ref={inputRef}
                    type="text"
                    role="combobox"
                    aria-expanded={isOpen}
                    aria-controls={listboxId}
                    aria-activedescendant={getActiveDescendant()}
                    aria-autocomplete="list"
                    aria-haspopup="listbox"
                    aria-label="Search for your college"
                    className={`input ${error ? 'input-error' : ''} ${selectedCollege ? 'has-selection' : ''}`}
                    placeholder="Start typing your college name..."
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => results.length > 0 && setIsOpen(true)}
                    disabled={disabled}
                    autoComplete="off"
                />

                {isLoading && (
                    <div className="autocomplete-spinner" aria-hidden="true">
                        <span className="spinner-small"></span>
                    </div>
                )}

                {selectedCollege && !isLoading && (
                    <div className="autocomplete-check" aria-hidden="true">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <polyline points="20,6 9,17 4,12" />
                        </svg>
                    </div>
                )}
            </div>

            {isOpen && (
                <ul
                    ref={listRef}
                    id={listboxId}
                    role="listbox"
                    aria-label="College suggestions"
                    className="autocomplete-listbox"
                >
                    {results.length > 0 ? (
                        <>
                            {results.map((college, index) => (
                                <li
                                    key={college.id}
                                    id={`college-option-${college.id}`}
                                    role="option"
                                    aria-selected={index === activeIndex}
                                    className={`autocomplete-option ${index === activeIndex ? 'active' : ''}`}
                                    onClick={() => handleSelect(college)}
                                    onMouseEnter={() => setActiveIndex(index)}
                                >
                                    <span className="option-name">{highlightMatch(college.name, inputValue)}</span>
                                    <span className="option-location">{college.city}, {college.state}</span>
                                </li>
                            ))}
                        </>
                    ) : inputValue.length >= 2 ? (
                        <li className="autocomplete-no-results">
                            No colleges found. Try a different spelling.
                        </li>
                    ) : null}

                    {inputValue.length >= 2 && (
                        <li
                            id="manual-entry-option"
                            role="option"
                            aria-selected={activeIndex === results.length}
                            className={`autocomplete-option manual-option ${activeIndex === results.length ? 'active' : ''}`}
                            onClick={handleManualEntry}
                            onMouseEnter={() => setActiveIndex(results.length)}
                        >
                            <span className="option-icon">✏️</span>
                            <span className="option-text">
                                <strong>My college not listed</strong>
                                <small>Enter "{inputValue}" manually</small>
                            </span>
                        </li>
                    )}
                </ul>
            )}
        </div>
    );
};

function highlightMatch(text, query) {
    if (!query) return text;

    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase();
    const index = lowerText.indexOf(lowerQuery);

    if (index === -1) return text;

    return (
        <>
            {text.substring(0, index)}
            <mark>{text.substring(index, index + query.length)}</mark>
            {text.substring(index + query.length)}
        </>
    );
}

export default CollegeAutocomplete;

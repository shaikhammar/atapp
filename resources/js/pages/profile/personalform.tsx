import { CaptionLabel, MonthGrid } from '@/components/comp-504';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import MultipleSelector, { Option } from '@/components/ui/multipleselector';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { countries } from '@/lib/countries';
import { cn } from '@/lib/utils';
import { Currency, Language, Profile } from '@/types';
import { useForm } from '@inertiajs/react';
import { eachYearOfInterval, endOfYear, format, startOfYear } from 'date-fns';
import { CalendarIcon, Check, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';
import { CaptionLabelProps, MonthGridProps } from 'react-day-picker';

function PersonalForm({ profile, currencies, languages }: { profile: Profile; currencies: Currency[]; languages: Language[] }) {
    // const { auth } = usePage<SharedData>().props;

    const languageOptions: Option[] = languages.map((language) => ({
        value: String(language.id), // convert to string if needed
        label: language.name,
    }));

    const today = new Date();
    const [dob, setDob] = useState<Date | undefined>(profile && profile.date_of_birth ? new Date(profile.date_of_birth) : undefined);
    const [month, setMonth] = useState(profile && profile.date_of_birth ? new Date(profile.date_of_birth) : today);

    const [isYearView, setIsYearView] = useState(false);
    const startDate = new Date(1980, 6);
    const endDate = new Date(2030, 6);
    const years = eachYearOfInterval({
        start: startOfYear(startDate),
        end: endOfYear(endDate),
    });

    const [open, setOpen] = useState(false);

    const [countryOpen, setCountryOpen] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState<string | undefined>(profile.address?.country);

    const [languageValue, setLanguageValue] = useState<Option[]>(
        profile && profile.native_languages ? profile.native_languages.map((lang) => ({ value: String(lang.id), label: lang.name })) : [],
    );

    const { data, setData, put, processing, errors, isDirty } = useForm({
        is_individual: profile && profile.is_individual ? profile.is_individual.toString() : '',
        first_name: profile ? profile.first_name : '',
        last_name: profile ? profile.last_name : '',
        company_name: profile ? profile.company_name : '',
        phone_number: profile ? profile.phone_number : '',
        date_of_birth: profile ? profile.date_of_birth : undefined,
        preferred_currency_id: profile && profile.preferred_currency_id ? profile.preferred_currency_id.toString() : '',
        is_translator: profile && profile.is_translator ? profile.is_translator.toString() : '',
        is_interpreter: profile && profile.is_interpreter ? profile.is_interpreter.toString() : '',
        native_languages: profile.native_languages?.map((lang) => lang.id) || [],
        secondary_email: profile && profile.secondary_email ? profile.secondary_email : '',
        secondary_phone: profile && profile.secondary_phone ? profile.secondary_phone : '',
        address: {
            address_line_1: profile && profile.address ? profile.address.address_line_1 : '',
            city: profile && profile.address ? profile.address.city : '',
            state: profile && profile.address ? profile.address.state : '',
            postal_code: profile && profile.address ? profile.address.postal_code : '',
            country: profile && profile.address ? profile.address.country : '',
        },
        // additional_fields: auth.user.add_info ? auth.user.add_info.additional_fields : [],
    });
    // const MAX_FIELDS = 6;

    // const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    // const [shouldFocus, setShouldFocus] = useState(false);

    // useLayoutEffect(() => {
    //     if (shouldFocus && inputRefs.current.length > 0) {
    //         const lastIndex = inputRefs.current.length - 1;
    //         inputRefs.current[lastIndex]?.focus();
    //         setShouldFocus(false); // reset flag
    //     }
    // }, [data.additional_fields.length]);

    // const handleAdditionalFieldChange = (index: number, field: 'key' | 'value', value: string) => {
    //     const updated = [...data.additional_fields];
    //     updated[index][field] = value;
    //     setData('additional_fields', updated);
    // };

    // const addAdditionalField = () => {
    //     if (data.additional_fields.length >= MAX_FIELDS) return;
    //     setData('additional_fields', [...data.additional_fields, { key: '', value: '' }]);
    //     setShouldFocus(true); // flag to trigger focus
    // };

    // const removeAdditionalField = (index: number) => {
    //     const updated = [...data.additional_fields];
    //     updated.splice(index, 1);
    //     setData('additional_fields', updated);
    // };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (isDirty) {
            put(route('profile.update'), {
                preserveScroll: true,
                // onSuccess: () => router.visit(route('profile.edit') + '#tab-2'),
            });
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="mb-4 grid gap-6 md:grid-cols-2">
                    <h1 className="text-l my-2 font-bold md:col-span-2">Personal Information</h1>
                    <div>
                        <Label className="mb-4" htmlFor="is_translator">
                            Are you a Translator?
                            <span className="text-tertiary ml-2 text-lg">*</span>
                        </Label>
                        <Select name="is_translator" onValueChange={(value) => setData('is_translator', value)} value={data.is_translator}>
                            <SelectTrigger className="">
                                <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">Yes</SelectItem>
                                <SelectItem value="0">No</SelectItem>
                            </SelectContent>
                        </Select>
                        <p className="text-tertiary mt-2 text-sm">{errors.is_translator}</p>
                    </div>
                    <div>
                        <Label className="mb-4">
                            Are you an Interpreter?
                            <span className="text-tertiary ml-2 text-lg">*</span>
                        </Label>
                        <Select onValueChange={(value) => setData('is_interpreter', value)} value={data.is_interpreter}>
                            <SelectTrigger className="">
                                <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">Yes</SelectItem>
                                <SelectItem value="0">No</SelectItem>
                            </SelectContent>
                        </Select>
                        <p className="text-tertiary mt-2 text-sm">{errors.is_interpreter}</p>
                    </div>
                    <div className="md:col-span-2">
                        <Label className="mb-4">
                            Type of User
                            <span className="text-tertiary ml-2 text-lg">*</span>
                        </Label>
                        <Select
                            onValueChange={(value) => {
                                if (value === '1') setData('company_name', '');
                                setData('is_individual', value);
                            }}
                            value={data.is_individual}
                        >
                            <SelectTrigger className="">
                                <SelectValue placeholder="Select Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">Individual</SelectItem>
                                <SelectItem value="0">Company</SelectItem>
                            </SelectContent>
                        </Select>
                        <p className="text-tertiary mt-2 text-sm">{errors.is_individual}</p>
                    </div>
                    <div className="md:col-span-2">
                        <Label className="mb-4">
                            Company Name
                            {data.is_individual && data.is_individual === '0' ? <span className="text-tertiary ml-2 text-lg">*</span> : ''}
                        </Label>
                        {!data.is_individual && data.is_individual === '' ? (
                            <Input
                                className=""
                                type="text"
                                name="company_name"
                                value={data.company_name}
                                placeholder="Enter company name"
                                onChange={(e) => setData('company_name', e.target.value)}
                                disabled={true}
                            />
                        ) : (
                            <Input
                                className=""
                                type="text"
                                name="company_name"
                                value={data.company_name}
                                placeholder="Enter company name"
                                onChange={(e) => setData('company_name', e.target.value)}
                                disabled={data.is_individual ? data.is_individual === '1' : false}
                            />
                        )}
                        <p className="text-tertiary mt-2 text-sm">{errors.company_name}</p>
                    </div>
                    <div>
                        <Label className="mb-4">
                            First Name
                            <span className="text-tertiary ml-2 text-lg">*</span>
                        </Label>
                        <Input
                            className=""
                            type="text"
                            name="first_name"
                            value={data.first_name}
                            placeholder="Enter first name"
                            onChange={(e) => setData('first_name', e.target.value)}
                        />
                        <p className="text-tertiary mt-2 text-sm">{errors.first_name}</p>
                    </div>
                    <div>
                        <Label className="mb-4">
                            Last Name
                            <span className="text-tertiary ml-2 text-lg">*</span>
                        </Label>
                        <Input
                            className=""
                            type="text"
                            name="last_name"
                            value={data.last_name}
                            placeholder="Enter last name"
                            onChange={(e) => setData('last_name', e.target.value)}
                        />
                        <p className="text-tertiary mt-2 text-sm">{errors.last_name}</p>
                    </div>
                    {/* <div>
                        <Label className="mb-4">
                            Email
                            <span className="text-tertiary ml-2 text-lg">*</span>
                        </Label>
                        <Input
                            className=""
                            type="text"
                            name="last_name"
                            value={auth.user.email}
                            placeholder="Enter email"
                            onChange={(e) => setData('last_name', e.target.value)}
                            disabled={true}
                        />
                    </div> */}
                    <div>
                        <Label className="mb-4">
                            Phone Number
                            <span className="text-tertiary ml-2 text-lg">*</span>
                        </Label>
                        <Input
                            className=""
                            type="text"
                            name="phone_number"
                            value={profile ? profile.phone_number : ''}
                            placeholder="Enter phone number"
                            onChange={(e) => setData('phone_number', e.target.value)}
                        />
                        <p className="text-tertiary mt-2 text-sm">{errors.phone_number}</p>
                    </div>
                    <div>
                        <Label className="mb-4">
                            Date of Birth
                            {data.is_individual && data.is_individual === '1' ? <span className="text-tertiary ml-2 text-lg">*</span> : ''}
                        </Label>
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                {data.is_individual && data.is_individual === '1' ? (
                                    <Button
                                        // disabled={data.is_individual ? data.is_individual === '1' : false}
                                        variant={'outline'}
                                        className={cn('w-full justify-start text-left font-normal', !dob && 'text-muted-foreground')}
                                    >
                                        <CalendarIcon />
                                        {dob ? format(dob, 'dd/MMM/yyyy') : <span>Pick a date</span>}
                                    </Button>
                                ) : (
                                    <Button
                                        disabled={true}
                                        variant={'outline'}
                                        className={cn('w-full justify-start text-left font-normal', !dob && 'text-muted-foreground')}
                                    >
                                        <CalendarIcon />
                                        {dob ? format(dob, 'dd/MMM/yyyy') : <span>Pick a date</span>}
                                    </Button>
                                )}
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-2" align="start">
                                <Calendar
                                    mode="single"
                                    selected={dob}
                                    onSelect={(date) => {
                                        if (date) {
                                            setDob(date);
                                            setData('date_of_birth', date);
                                        }
                                        setOpen(false);
                                    }}
                                    month={month}
                                    onMonthChange={setMonth}
                                    defaultMonth={new Date()}
                                    startMonth={startDate}
                                    endMonth={endDate}
                                    className="overflow-hidden rounded-md border p-2"
                                    classNames={{
                                        month_caption: 'ms-2.5 me-20 justify-start',
                                        nav: 'justify-end',
                                    }}
                                    components={{
                                        CaptionLabel: (props: CaptionLabelProps) => (
                                            <CaptionLabel isYearView={isYearView} setIsYearView={setIsYearView} {...props} />
                                        ),
                                        MonthGrid: (props: MonthGridProps) => {
                                            return (
                                                <MonthGrid
                                                    className={props.className}
                                                    isYearView={isYearView}
                                                    setIsYearView={setIsYearView}
                                                    startDate={startDate}
                                                    endDate={endDate}
                                                    years={years}
                                                    currentYear={month.getFullYear()}
                                                    currentMonth={month.getMonth()}
                                                    onMonthSelect={(selectedMonth: Date) => {
                                                        setMonth(selectedMonth);
                                                        setIsYearView(false);
                                                    }}
                                                >
                                                    {props.children}
                                                </MonthGrid>
                                            );
                                        },
                                    }}
                                />
                            </PopoverContent>
                        </Popover>
                        <p className="text-tertiary mt-2 text-sm">{errors.date_of_birth}</p>
                    </div>
                    <div>
                        <Label className="mb-4">
                            Preferred Currency
                            <span className="text-tertiary ml-2 text-lg">*</span>
                        </Label>
                        <Select onValueChange={(value) => setData('preferred_currency_id', value)} value={data.preferred_currency_id}>
                            <SelectTrigger className="">
                                <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                                {currencies.map((currency) => (
                                    <SelectItem key={currency.code} value={currency.id.toString()}>
                                        {currency.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <p className="text-tertiary mt-2 text-sm">{errors.preferred_currency_id}</p>
                    </div>
                    <div>
                        <div className="*:not-first:mt-1">
                            <Label>Native Languages</Label>
                            <MultipleSelector
                                commandProps={{
                                    label: 'Select up to 2 native languages',
                                }}
                                maxSelected={2}
                                defaultOptions={languageOptions}
                                value={languageValue}
                                onChange={(language) => {
                                    setLanguageValue(language);
                                    setData(
                                        'native_languages',
                                        language.map((lang) => Number(lang.value)),
                                    );
                                }}
                                placeholder="Select up to 2 native languages"
                                emptyIndicator={<p className="text-center text-sm">No results found</p>}
                            />
                        </div>
                        <p className="text-tertiary mt-2 text-sm">{errors.native_languages}</p>
                    </div>
                    <h1 className="text-l my-2 font-bold md:col-span-2">Address Information</h1>
                    <div className="md:col-span-2">
                        <Label className="mb-4">
                            Street Address
                            <span className="text-tertiary ml-2 text-lg">*</span>
                        </Label>
                        <Input
                            className=""
                            type="text"
                            name="address_line_1"
                            value={data.address.address_line_1}
                            placeholder="Enter street address"
                            onChange={(e) => setData('address', { ...data.address, address_line_1: e.target.value })}
                        />
                        <p className="text-tertiary mt-2 text-sm">{errors['address.address_line_1']}</p>
                        {/* <p className="text-tertiary mt-2 text-sm">{errors.address}</p> */}
                    </div>
                    <div>
                        <Label className="mb-4">
                            City
                            <span className="text-tertiary ml-2 text-lg">*</span>
                        </Label>
                        <Input
                            className=""
                            type="text"
                            name="city"
                            value={data.address.city}
                            placeholder="Enter city"
                            onChange={(e) => setData('address', { ...data.address, city: e.target.value })}
                        />
                        <p className="text-tertiary mt-2 text-sm">{errors['address.city']}</p>
                    </div>
                    <div>
                        <Label className="mb-4">
                            State/Province
                            <span className="text-tertiary ml-2 text-lg">*</span>
                        </Label>
                        <Input
                            className=""
                            type="text"
                            name="state"
                            value={data.address.state}
                            placeholder="Enter state/province"
                            onChange={(e) => setData('address', { ...data.address, state: e.target.value })}
                        />
                        <p className="text-tertiary mt-2 text-sm">{errors['address.state']}</p>
                    </div>
                    <div>
                        <Label className="mb-4">
                            Postal Code
                            <span className="text-tertiary ml-2 text-lg">*</span>
                        </Label>
                        <Input
                            className=""
                            type="text"
                            name="postal_code"
                            value={data.address.postal_code}
                            placeholder="Enter postal code"
                            onChange={(e) => setData('address', { ...data.address, postal_code: e.target.value })}
                        />
                        <p className="text-tertiary mt-2 text-sm">{errors['address.postal_code']}</p>
                    </div>
                    <div>
                        <Label className="mb-4">
                            Country
                            <span className="text-tertiary ml-2 text-lg">*</span>
                        </Label>
                        <Popover open={countryOpen} onOpenChange={setCountryOpen}>
                            <PopoverTrigger asChild>
                                <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
                                    {selectedCountry ? countries.find((country) => country.value === selectedCountry)?.label : 'Select country...'}
                                    <ChevronsUpDown className="opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0">
                                <Command>
                                    <CommandInput placeholder="Search country..." className="h-9" />
                                    <CommandList>
                                        <CommandEmpty>No country found.</CommandEmpty>
                                        <CommandGroup>
                                            {countries.map((country) => (
                                                <CommandItem
                                                    key={country.value}
                                                    value={country.value}
                                                    onSelect={(currentValue) => {
                                                        setSelectedCountry(currentValue === selectedCountry ? '' : currentValue);
                                                        setData('address', {
                                                            ...data.address,
                                                            country: currentValue === selectedCountry ? '' : currentValue,
                                                        });
                                                        setCountryOpen(false);
                                                    }}
                                                >
                                                    {country.label}
                                                    <Check
                                                        className={cn('ml-auto', selectedCountry === country.value ? 'opacity-100' : 'opacity-0')}
                                                    />
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                        <p className="text-tertiary mt-2 text-sm">{errors['address.country']}</p>
                    </div>
                    <h1 className="text-l my-2 font-bold md:col-span-2">Additional Information</h1>
                    <div>
                        <Label className="mb-4">Secondary Phone Number</Label>
                        <Input
                            className=""
                            type="text"
                            name="secondary_phone"
                            value={data.secondary_phone}
                            placeholder="Enter secondary phone number"
                            onChange={(e) => setData('secondary_phone', e.target.value)}
                        />
                    </div>
                    <div>
                        <Label className="mb-4">Secondary Email</Label>
                        <Input
                            className=""
                            type="text"
                            name="secondary_email"
                            value={data.secondary_email}
                            placeholder="Enter secondary email"
                            onChange={(e) => setData('secondary_email', e.target.value)}
                        />
                    </div>
                    {/* {data.additional_fields.map((field, index) => (
                        <div key={index} className="mb-2 flex gap-2">
                            <Input
                                type="text"
                                placeholder="Key"
                                className="input"
                                value={field.key}
                                onChange={(e) => handleAdditionalFieldChange(index, 'key', e.target.value)}
                                ref={(el) => {
                                    if (el) inputRefs.current[index] = el;
                                }}
                            />
                            <Input
                                type="text"
                                placeholder="Value"
                                className="input"
                                value={field.value}
                                onChange={(e) => handleAdditionalFieldChange(index, 'value', e.target.value)}
                            />
                            <Button onClick={() => removeAdditionalField(index)} type="button">
                                Remove
                            </Button>
                        </div>
                    ))}

                    <Button type="button" onClick={addAdditionalField} disabled={data.additional_fields.length >= MAX_FIELDS}>
                        Add Additional Field
                    </Button>
                    {data.additional_fields.length >= MAX_FIELDS && <p className="text-tertiary mt-1 text-sm">No more fields can be added.</p>} */}
                </div>
                <div className="mt-6 text-right">
                    <Button type="submit" disabled={processing}>
                        {processing ? 'Saving...' : 'Save changes'}
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default PersonalForm;

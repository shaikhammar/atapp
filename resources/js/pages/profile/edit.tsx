import { Head, router, usePage } from '@inertiajs/react';

import AppLayout from '@/layouts/app-layout';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import { useFileUpload } from '@/hooks/use-file-upload';
import { useRoles } from '@/hooks/use-roles';

import { Currency, Language, Profile, SharedData, type BreadcrumbItem } from '@/types';

import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    CircleUserRound,
    CircleUserRoundIcon,
    ClipboardList,
    Files,
    FlaskRound,
    HandCoins,
    PocketKnife,
    ScrollText,
    Speech,
    XIcon,
} from 'lucide-react';
import { useState } from 'react';
import PersonalForm from './personalform';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile',
        href: '/profile',
    },
    {
        title: 'Edit Profile',
        href: '/profile/edit',
    },
];

const adminBreadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin Dashboard',
        href: '/dashboard',
    },
];

export default function Edit() {
    const { auth, profile, currencies, languages } = usePage<SharedData & { profile: Profile; currencies: Currency[]; languages: Language[] }>()
        .props;
    const { hasRole } = useRoles();

    const activeTabFromUrl = window.location.hash.substring(1);
    const [activeTab, setActiveTab] = useState<string>(activeTabFromUrl || 'tab-1');

    const [{ files, isDragging }, { removeFile, openFileDialog, getInputProps, handleDragEnter, handleDragLeave, handleDragOver, handleDrop }] =
        useFileUpload({
            accept: 'image/*',
            multiple: false,
            onFilesAdded(newFiles) {
                if (newFiles && newFiles[0]?.file) {
                    const avatarFile = newFiles[0]?.file;

                    router.post(route('profile.avatar.update'), {
                        avatar: avatarFile,
                        preserveState: true,
                        async: true,
                        forceFormData: true,
                        preserveScroll: true,
                    });
                }
            },
        });

    const avatarFromServer = profile?.avatar ? `/storage/${profile.avatar}` : null;

    const removeAvatar = () => {
        router.delete(route('profile.avatar.destroy'), {
            preserveState: true,
            async: true,
            forceFormData: true,
            preserveScroll: true,
        });
    };

    const previewUrl = files[0]?.preview || avatarFromServer;

    return (
        <AppLayout breadcrumbs={hasRole(auth.user, 'admin') ? adminBreadcrumbs : breadcrumbs}>
            {hasRole(auth.user, 'admin') ? <Head title="Admin dashboard" /> : <Head title="Profile" />}
            <div className="container mx-auto px-4 py-6">
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
                    <div className="col-span-1">
                        <Card>
                            <CardContent>
                                <div className="flex flex-col items-center gap-2 p-6">
                                    <div className="relative inline-flex">
                                        {/* Drop area */}
                                        <div
                                            className="border-input hover:bg-accent/50 data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 relative flex size-32 items-center justify-center overflow-hidden rounded-full border border-dashed transition-colors has-disabled:pointer-events-none has-disabled:opacity-50 has-[img]:border-none has-[input:focus]:ring-[3px]"
                                            role="button"
                                            onClick={openFileDialog}
                                            onDragEnter={handleDragEnter}
                                            onDragLeave={handleDragLeave}
                                            onDragOver={handleDragOver}
                                            onDrop={handleDrop}
                                            data-dragging={isDragging || undefined}
                                            aria-label={previewUrl ? 'Change image' : 'Upload image'}
                                        >
                                            {previewUrl ? (
                                                <img
                                                    className="size-full object-cover"
                                                    src={previewUrl}
                                                    alt={files[0]?.file?.name || 'Uploaded image'}
                                                    width={64}
                                                    height={64}
                                                    style={{ objectFit: 'cover' }}
                                                />
                                            ) : (
                                                <div aria-hidden="true">
                                                    <CircleUserRoundIcon className="size-6 opacity-60" />
                                                </div>
                                            )}
                                        </div>
                                        {previewUrl && (
                                            <Button
                                                onClick={() => {
                                                    removeFile(files[0]?.id);
                                                    removeAvatar();
                                                }}
                                                size="icon"
                                                className="border-background focus-visible:border-background absolute -top-1 -right-1 size-6 rounded-full border-2 shadow-none"
                                                aria-label="Remove image"
                                            >
                                                <XIcon className="size-3.5" />
                                            </Button>
                                        )}
                                        <input {...getInputProps()} className="sr-only" aria-label="Upload image file" />
                                    </div>
                                </div>
                                <div className="mt-2 text-center">
                                    <h5 className="mb-1 text-2xl font-semibold">
                                        {profile?.first_name} {profile?.last_name}
                                    </h5>
                                    <p className="text-muted-foreground mb-0">{auth.user.email}</p>
                                    <p className="text-muted-foreground mb-0">ID: SP250400504</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="col-span-1 lg:col-span-3">
                        <Card>
                            <CardContent>
                                <Tabs
                                    value={activeTab}
                                    onValueChange={(value) => {
                                        setActiveTab(value);
                                        window.location.hash = value;
                                    }}
                                    className="scroll-auto"
                                >
                                    <ScrollArea>
                                        <TabsList className="mb-3">
                                            <TabsTrigger value="tab-1">
                                                <CircleUserRound className="-ms-0.5 me-1.5 opacity-60" size={16} aria-hidden="true" />
                                                Personal Information
                                            </TabsTrigger>
                                            <TabsTrigger value="tab-2" className="group">
                                                <FlaskRound className="-ms-0.5 me-1.5 opacity-60" size={16} aria-hidden="true" />
                                                Domains
                                                {/* <Badge
                                                    className="bg-primary/15 ms-1.5 min-w-5 px-1 transition-opacity group-data-[state=inactive]:opacity-50"
                                                    variant="secondary"
                                                >
                                                    3
                                                </Badge> */}
                                            </TabsTrigger>
                                            <TabsTrigger value="tab-3" className="group">
                                                <PocketKnife className="-ms-0.5 me-1.5 opacity-60" size={16} aria-hidden="true" />
                                                Translation Tools
                                                {/* <Badge className="ms-1.5 transition-opacity group-data-[state=inactive]:opacity-50">New</Badge> */}
                                            </TabsTrigger>
                                            <TabsTrigger value="tab-4" className="group">
                                                <ClipboardList className="-ms-0.5 me-1.5 opacity-60" size={16} aria-hidden="true" />
                                                Language Pairs & Rate
                                                {/* <Badge className="ms-1.5 transition-opacity group-data-[state=inactive]:opacity-50">New</Badge> */}
                                            </TabsTrigger>
                                            <TabsTrigger value="tab-5" className="group">
                                                <ScrollText className="-ms-0.5 me-1.5 opacity-60" size={16} aria-hidden="true" />
                                                Qualifications
                                                {/* <Badge className="ms-1.5 transition-opacity group-data-[state=inactive]:opacity-50">New</Badge> */}
                                            </TabsTrigger>
                                            <TabsTrigger value="tab-6" className="group">
                                                <Speech className="-ms-0.5 me-1.5 opacity-60" size={16} aria-hidden="true" />
                                                References
                                                {/* <Badge className="ms-1.5 transition-opacity group-data-[state=inactive]:opacity-50">New</Badge> */}
                                            </TabsTrigger>
                                            <TabsTrigger value="tab-7" className="group">
                                                <HandCoins className="-ms-0.5 me-1.5 opacity-60" size={16} aria-hidden="true" />
                                                Payment
                                                {/* <Badge className="ms-1.5 transition-opacity group-data-[state=inactive]:opacity-50">New</Badge> */}
                                            </TabsTrigger>
                                            <TabsTrigger value="tab-8" className="group">
                                                <Files className="-ms-0.5 me-1.5 opacity-60" size={16} aria-hidden="true" />
                                                Documents
                                                {/* <Badge className="ms-1.5 transition-opacity group-data-[state=inactive]:opacity-50">New</Badge> */}
                                            </TabsTrigger>
                                        </TabsList>
                                        <ScrollBar orientation="horizontal" />
                                    </ScrollArea>
                                    <TabsContent value="tab-1">
                                        <PersonalForm profile={profile} currencies={currencies} languages={languages} />
                                        {/* <p className="text-muted-foreground p-4 pt-1 text-center text-xs">Content for Tab 1</p> */}
                                    </TabsContent>
                                    <TabsContent value="tab-2">
                                        <p className="text-muted-foreground p-4 pt-1 text-center text-xs">Content for Tab 2</p>
                                    </TabsContent>
                                    <TabsContent value="tab-3">
                                        <p className="text-muted-foreground p-4 pt-1 text-center text-xs">Content for Tab 3</p>
                                    </TabsContent>
                                </Tabs>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            <div className="container">
                <div className="container">
                    <div className="flex flex-col xl:flex-row"></div>
                    {/* <div className="flex flex-col">
                        <div className="mt-xxl-n5 card">
                            <div className="card-header">
                                <ul role="tablist" className="nav-tabs-custom card-header-tabs border-bottom-0 nav rounded">
                                    <li className="nav-item">
                                        <a className="active nav-link">
                                            <i className="fas fa-home"></i>Personal / Account Information
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a href="#" type="button" className="nav-link">
                                            <i className="far fa-user"></i>Translation Expertise
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a href="#" type="button" className="nav-link">
                                            <i className="far fa-envelope"></i>Language Pairs &amp; Rates
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a href="#" type="button" className="nav-link">
                                            <i className="far fa-envelope"></i>Qualifications
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a href="#" type="button" className="nav-link">
                                            <i className="far fa-envelope"></i>References
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a href="#" type="button" className="nav-link">
                                            <i className="far fa-envelope"></i>CV &amp; Documents
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div className="card-body p-4">
                                <div className="tab-content">
                                    <div className="tab-pane active">
                                        <form>
                                            <div className="row">
                                                <div className="col-lg-12">
                                                    <h5 className="mb-4">Account Information</h5>
                                                </div>
                                                <div className="row">
                                                    <div className="col-lg-6">
                                                        <div className="mb-3">
                                                            <label htmlFor="isTranslator" className="form-label form-label">
                                                                Are you a Translator?
                                                            </label>
                                                            <select className="form-select" id="isTranslator" name="isTranslator">
                                                                <option value="">Select</option>
                                                                <option value="true">Yes</option>
                                                                <option value="false">No</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-6">
                                                        <div className="mb-3">
                                                            <label htmlFor="isInterpreter" className="form-label form-label">
                                                                Are you an Interpreter?
                                                            </label>
                                                            <select className="form-select" id="isInterpreter" name="isInterpreter">
                                                                <option value="">Select</option>
                                                                <option value="true">Yes</option>
                                                                <option value="false">No</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-lg-12">
                                                    <div className="mb-3">
                                                        <label htmlFor="type" className="form-label form-label">
                                                            Type of User
                                                        </label>
                                                        <select className="form-select" id="type" name="type">
                                                            <option value="">Select Type</option>
                                                            <option value="BUSINESS">Business</option>
                                                            <option value="INDIVIDUAL">Individual</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="col-lg-12">
                                                    <div className="mb-3">
                                                        <label htmlFor="companyName" className="form-label form-label">
                                                            Company Name
                                                        </label>
                                                        <Input
                                                            id="companyName"
                                                            placeholder="Enter company name"
                                                            name="companyName"
                                                            disabled={false}
                                                            type="text"
                                                            className="form-control"
                                                            value=""
                                                        ></Input>
                                                    </div>
                                                </div>
                                                <div className="col-lg-6">
                                                    <div className="mb-3">
                                                        <label htmlFor="firstName" className="form-label form-label">
                                                            First Name
                                                        </label>
                                                        <Input
                                                            id="firstName"
                                                            placeholder="Enter first name"
                                                            name="firstName"
                                                            type="text"
                                                            className="form-control"
                                                            value="Ahmed"
                                                        ></Input>
                                                    </div>
                                                </div>
                                                <div className="col-lg-6">
                                                    <div className="mb-3">
                                                        <label htmlFor="lastName" className="form-label form-label">
                                                            Last Name
                                                        </label>
                                                        <Input
                                                            id="lastName"
                                                            placeholder="Enter last name"
                                                            name="lastName"
                                                            type="text"
                                                            className="form-control"
                                                            value="Manzoor"
                                                        ></Input>
                                                    </div>
                                                </div>
                                                <div className="col-lg-6">
                                                    <div className="mb-3">
                                                        <label htmlFor="email" className="form-label form-label">
                                                            Email
                                                        </label>
                                                        <Input
                                                            id="email"
                                                            placeholder="Enter email"
                                                            name="email"
                                                            disabled={false}
                                                            type="email"
                                                            className="form-control"
                                                            value="ahmedmanzooor@gmail.com"
                                                        ></Input>
                                                    </div>
                                                </div>
                                                <div className="col-lg-6">
                                                    <div className="mb-3">
                                                        <label htmlFor="phoneNumber" className="form-label form-label">
                                                            Phone Number
                                                        </label>
                                                        <Input
                                                            id="phoneNumber"
                                                            placeholder="Enter phone number"
                                                            name="phoneNumber"
                                                            type="tel"
                                                            className="form-control"
                                                            value="+1 (984) 349 2567"
                                                        ></Input>
                                                    </div>
                                                </div>
                                                <div className="col-lg-6">
                                                    <div className="mb-3">
                                                        <label htmlFor="dateOfBirth" className="form-label form-label">
                                                            Date of Birth
                                                        </label>
                                                        <Input
                                                            className="form-control flatpickr-input"
                                                            placeholder="Select date of birth"
                                                            value=""
                                                            type="text"
                                                            readOnly={true}
                                                        ></Input>
                                                    </div>
                                                </div>
                                                <div className="col-lg-6">
                                                    <div className="mb-3">
                                                        <label htmlFor="preferredCurrency" className="form-label form-label">
                                                            Preferred Currency
                                                        </label>
                                                        <select className="form-select" id="preferredCurrency" name="preferredCurrency">
                                                            <option value="">Select Preferred Currency</option>
                                                            <option value="7ea06a4b-cf6e-4a50-8070-3e63b56d62ea">Canadian Dollar (CAD)</option>
                                                            <option value="621b6bbd-9a4b-4a81-8379-1b2635d31403">Euro (EUR)</option>
                                                            <option value="cb389056-b81d-40f6-a95a-f91f1e4872a5">US Dollar (USD)</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="col-lg-12">
                                                    <h5 className="mt-4 mb-4">Address Information</h5>
                                                </div>
                                                <div className="col-lg-12">
                                                    <div className="mb-3">
                                                        <label htmlFor="address" className="form-label form-label">
                                                            Street Address
                                                        </label>
                                                        <Input
                                                            id="address"
                                                            placeholder="Enter street address"
                                                            name="address"
                                                            type="text"
                                                            className="form-control"
                                                            value="1550 Como Park Blvd"
                                                        ></Input>
                                                    </div>
                                                </div>
                                                <div className="col-lg-6">
                                                    <div className="mb-3">
                                                        <label htmlFor="city" className="form-label form-label">
                                                            City
                                                        </label>
                                                        <Input
                                                            id="city"
                                                            placeholder="Enter city"
                                                            name="city"
                                                            type="text"
                                                            className="form-control"
                                                            value="Depew"
                                                        ></Input>
                                                    </div>
                                                </div>
                                                <div className="col-lg-6">
                                                    <div className="mb-3">
                                                        <label htmlFor="province" className="form-label form-label">
                                                            Province
                                                        </label>
                                                        <Input
                                                            id="province"
                                                            placeholder="Enter province"
                                                            name="province"
                                                            type="text"
                                                            className="form-control"
                                                            value="NY"
                                                        ></Input>
                                                    </div>
                                                </div>
                                                <div className="col-lg-6">
                                                    <div className="mb-3">
                                                        <label htmlFor="zipCode" className="form-label form-label">
                                                            ZIP Code
                                                        </label>
                                                        <Input
                                                            id="zipCode"
                                                            placeholder="Enter ZIP code"
                                                            name="zipCode"
                                                            type="text"
                                                            className="form-control"
                                                            value="14043"
                                                        ></Input>
                                                    </div>
                                                </div>
                                                <div className="col-lg-6">
                                                    <div className="mb-3">
                                                        <label htmlFor="countryOfResidency" className="form-label form-label">
                                                            Country of Residency
                                                        </label>
                                                        <select className="form-select" id="countryOfResidency" name="countryOfResidency">
                                                            <option value="">Select country of residency</option>
                                                            <option value="AF">Afghanistan</option>
                                                            <option value="AX">land Islands</option>
                                                            <option value="AL">Albania</option>
                                                            <option value="DZ">Algeria</option>
                                                            <option value="AS">American Samoa</option>
                                                            <option value="AD">AndorrA</option>
                                                            <option value="AO">Angola</option>
                                                            <option value="AI">Anguilla</option>
                                                            <option value="AQ">Antarctica</option>
                                                            <option value="AG">Antigua and Barbuda</option>
                                                            <option value="AR">Argentina</option>
                                                            <option value="AM">Armenia</option>
                                                            <option value="AW">Aruba</option>
                                                            <option value="AU">Australia</option>
                                                            <option value="AT">Austria</option>
                                                            <option value="AZ">Azerbaijan</option>
                                                            <option value="BS">Bahamas</option>
                                                            <option value="BH">Bahrain</option>
                                                            <option value="BD">Bangladesh</option>
                                                            <option value="BB">Barbados</option>
                                                            <option value="BY">Belarus</option>
                                                            <option value="BE">Belgium</option>
                                                            <option value="BZ">Belize</option>
                                                            <option value="BJ">Benin</option>
                                                            <option value="BM">Bermuda</option>
                                                            <option value="BT">Bhutan</option>
                                                            <option value="BO">Bolivia</option>
                                                            <option value="BA">Bosnia and Herzegovina</option>
                                                            <option value="BW">Botswana</option>
                                                            <option value="BV">Bouvet Island</option>
                                                            <option value="BR">Brazil</option>
                                                            <option value="IO">British Indian Ocean Territory</option>
                                                            <option value="BN">Brunei Darussalam</option>
                                                            <option value="BG">Bulgaria</option>
                                                            <option value="BF">Burkina Faso</option>
                                                            <option value="BI">Burundi</option>
                                                            <option value="KH">Cambodia</option>
                                                            <option value="CM">Cameroon</option>
                                                            <option value="CA">Canada</option>
                                                            <option value="CV">Cape Verde</option>
                                                            <option value="KY">Cayman Islands</option>
                                                            <option value="CF">Central African Republic</option>
                                                            <option value="TD">Chad</option>
                                                            <option value="CL">Chile</option>
                                                            <option value="CN">China</option>
                                                            <option value="CX">Christmas Island</option>
                                                            <option value="CC">Cocos (Keeling) Islands</option>
                                                            <option value="CO">Colombia</option>
                                                            <option value="KM">Comoros</option>
                                                            <option value="CG">Congo</option>
                                                            <option value="CD">Congo, The Democratic Republic of the</option>
                                                            <option value="CK">Cook Islands</option>
                                                            <option value="CR">Costa Rica</option>
                                                            <option value="CI">Cote D"Ivoire</option>
                                                            <option value="HR">Croatia</option>
                                                            <option value="CU">Cuba</option>
                                                            <option value="CY">Cyprus</option>
                                                            <option value="CZ">Czech Republic</option>
                                                            <option value="DK">Denmark</option>
                                                            <option value="DJ">Djibouti</option>
                                                            <option value="DM">Dominica</option>
                                                            <option value="DO">Dominican Republic</option>
                                                            <option value="EC">Ecuador</option>
                                                            <option value="EG">Egypt</option>
                                                            <option value="SV">El Salvador</option>
                                                            <option value="GQ">Equatorial Guinea</option>
                                                            <option value="ER">Eritrea</option>
                                                            <option value="EE">Estonia</option>
                                                            <option value="ET">Ethiopia</option>
                                                            <option value="FK">Falkland Islands (Malvinas)</option>
                                                            <option value="FO">Faroe Islands</option>
                                                            <option value="FJ">Fiji</option>
                                                            <option value="FI">Finland</option>
                                                            <option value="FR">France</option>
                                                            <option value="GF">French Guiana</option>
                                                            <option value="PF">French Polynesia</option>
                                                            <option value="TF">French Southern Territories</option>
                                                            <option value="GA">Gabon</option>
                                                            <option value="GM">Gambia</option>
                                                            <option value="GE">Georgia</option>
                                                            <option value="DE">Germany</option>
                                                            <option value="GH">Ghana</option>
                                                            <option value="GI">Gibraltar</option>
                                                            <option value="GR">Greece</option>
                                                            <option value="GL">Greenland</option>
                                                            <option value="GD">Grenada</option>
                                                            <option value="GP">Guadeloupe</option>
                                                            <option value="GU">Guam</option>
                                                            <option value="GT">Guatemala</option>
                                                            <option value="GG">Guernsey</option>
                                                            <option value="GN">Guinea</option>
                                                            <option value="GW">Guinea-Bissau</option>
                                                            <option value="GY">Guyana</option>
                                                            <option value="HT">Haiti</option>
                                                            <option value="HM">Heard Island and Mcdonald Islands</option>
                                                            <option value="VA">Holy See (Vatican City State)</option>
                                                            <option value="HN">Honduras</option>
                                                            <option value="HK">Hong Kong</option>
                                                            <option value="HU">Hungary</option>
                                                            <option value="IS">Iceland</option>
                                                            <option value="IN">India</option>
                                                            <option value="ID">Indonesia</option>
                                                            <option value="IR">Iran, Islamic Republic Of</option>
                                                            <option value="IQ">Iraq</option>
                                                            <option value="IE">Ireland</option>
                                                            <option value="IM">Isle of Man</option>
                                                            <option value="IL">Israel</option>
                                                            <option value="IT">Italy</option>
                                                            <option value="JM">Jamaica</option>
                                                            <option value="JP">Japan</option>
                                                            <option value="JE">Jersey</option>
                                                            <option value="JO">Jordan</option>
                                                            <option value="KZ">Kazakhstan</option>
                                                            <option value="KE">Kenya</option>
                                                            <option value="KI">Kiribati</option>
                                                            <option value="KP">Korea, Democratic People"S Republic of</option>
                                                            <option value="KR">Korea, Republic of</option>
                                                            <option value="KW">Kuwait</option>
                                                            <option value="KG">Kyrgyzstan</option>
                                                            <option value="LA">Lao People"S Democratic Republic</option>
                                                            <option value="LV">Latvia</option>
                                                            <option value="LB">Lebanon</option>
                                                            <option value="LS">Lesotho</option>
                                                            <option value="LR">Liberia</option>
                                                            <option value="LY">Libyan Arab Jamahiriya</option>
                                                            <option value="LI">Liechtenstein</option>
                                                            <option value="LT">Lithuania</option>
                                                            <option value="LU">Luxembourg</option>
                                                            <option value="MO">Macao</option>
                                                            <option value="MK">Macedonia, The Former Yugoslav Republic of</option>
                                                            <option value="MG">Madagascar</option>
                                                            <option value="MW">Malawi</option>
                                                            <option value="MY">Malaysia</option>
                                                            <option value="MV">Maldives</option>
                                                            <option value="ML">Mali</option>
                                                            <option value="MT">Malta</option>
                                                            <option value="MH">Marshall Islands</option>
                                                            <option value="MQ">Martinique</option>
                                                            <option value="MR">Mauritania</option>
                                                            <option value="MU">Mauritius</option>
                                                            <option value="YT">Mayotte</option>
                                                            <option value="MX">Mexico</option>
                                                            <option value="FM">Micronesia, Federated States of</option>
                                                            <option value="MD">Moldova, Republic of</option>
                                                            <option value="MC">Monaco</option>
                                                            <option value="MN">Mongolia</option>
                                                            <option value="ME">Montenegro</option>
                                                            <option value="MS">Montserrat</option>
                                                            <option value="MA">Morocco</option>
                                                            <option value="MZ">Mozambique</option>
                                                            <option value="MM">Myanmar</option>
                                                            <option value="NA">Namibia</option>
                                                            <option value="NR">Nauru</option>
                                                            <option value="NP">Nepal</option>
                                                            <option value="NL">Netherlands</option>
                                                            <option value="AN">Netherlands Antilles</option>
                                                            <option value="NC">New Caledonia</option>
                                                            <option value="NZ">New Zealand</option>
                                                            <option value="NI">Nicaragua</option>
                                                            <option value="NE">Niger</option>
                                                            <option value="NG">Nigeria</option>
                                                            <option value="NU">Niue</option>
                                                            <option value="NF">Norfolk Island</option>
                                                            <option value="MP">Northern Mariana Islands</option>
                                                            <option value="NO">Norway</option>
                                                            <option value="OM">Oman</option>
                                                            <option value="PK">Pakistan</option>
                                                            <option value="PW">Palau</option>
                                                            <option value="PS">Palestinian Territory, Occupied</option>
                                                            <option value="PA">Panama</option>
                                                            <option value="PG">Papua New Guinea</option>
                                                            <option value="PY">Paraguay</option>
                                                            <option value="PE">Peru</option>
                                                            <option value="PH">Philippines</option>
                                                            <option value="PN">Pitcairn</option>
                                                            <option value="PL">Poland</option>
                                                            <option value="PT">Portugal</option>
                                                            <option value="PR">Puerto Rico</option>
                                                            <option value="QA">Qatar</option>
                                                            <option value="RE">Reunion</option>
                                                            <option value="RO">Romania</option>
                                                            <option value="RU">Russian Federation</option>
                                                            <option value="RW">RWANDA</option>
                                                            <option value="SH">Saint Helena</option>
                                                            <option value="KN">Saint Kitts and Nevis</option>
                                                            <option value="LC">Saint Lucia</option>
                                                            <option value="PM">Saint Pierre and Miquelon</option>
                                                            <option value="VC">Saint Vincent and the Grenadines</option>
                                                            <option value="WS">Samoa</option>
                                                            <option value="SM">San Marino</option>
                                                            <option value="ST">Sao Tome and Principe</option>
                                                            <option value="SA">Saudi Arabia</option>
                                                            <option value="SN">Senegal</option>
                                                            <option value="RS">Serbia</option>
                                                            <option value="SC">Seychelles</option>
                                                            <option value="SL">Sierra Leone</option>
                                                            <option value="SG">Singapore</option>
                                                            <option value="SK">Slovakia</option>
                                                            <option value="SI">Slovenia</option>
                                                            <option value="SB">Solomon Islands</option>
                                                            <option value="SO">Somalia</option>
                                                            <option value="ZA">South Africa</option>
                                                            <option value="GS">South Georgia and the South Sandwich Islands</option>
                                                            <option value="ES">Spain</option>
                                                            <option value="LK">Sri Lanka</option>
                                                            <option value="SD">Sudan</option>
                                                            <option value="SR">Suriname</option>
                                                            <option value="SJ">Svalbard and Jan Mayen</option>
                                                            <option value="SZ">Swaziland</option>
                                                            <option value="SE">Sweden</option>
                                                            <option value="CH">Switzerland</option>
                                                            <option value="SY">Syrian Arab Republic</option>
                                                            <option value="TW">Taiwan, Province of China</option>
                                                            <option value="TJ">Tajikistan</option>
                                                            <option value="TZ">Tanzania, United Republic of</option>
                                                            <option value="TH">Thailand</option>
                                                            <option value="TL">Timor-Leste</option>
                                                            <option value="TG">Togo</option>
                                                            <option value="TK">Tokelau</option>
                                                            <option value="TO">Tonga</option>
                                                            <option value="TT">Trinidad and Tobago</option>
                                                            <option value="TN">Tunisia</option>
                                                            <option value="TR">Turkey</option>
                                                            <option value="TM">Turkmenistan</option>
                                                            <option value="TC">Turks and Caicos Islands</option>
                                                            <option value="TV">Tuvalu</option>
                                                            <option value="UG">Uganda</option>
                                                            <option value="UA">Ukraine</option>
                                                            <option value="AE">United Arab Emirates</option>
                                                            <option value="GB">United Kingdom</option>
                                                            <option value="US">United States</option>
                                                            <option value="UM">United States Minor Outlying Islands</option>
                                                            <option value="UY">Uruguay</option>
                                                            <option value="UZ">Uzbekistan</option>
                                                            <option value="VU">Vanuatu</option>
                                                            <option value="VE">Venezuela</option>
                                                            <option value="VN">Viet Nam</option>
                                                            <option value="VG">Virgin Islands, British</option>
                                                            <option value="VI">Virgin Islands, U.S.</option>
                                                            <option value="WF">Wallis and Futuna</option>
                                                            <option value="EH">Western Sahara</option>
                                                            <option value="YE">Yemen</option>
                                                            <option value="ZM">Zambia</option>
                                                            <option value="ZW">Zimbabwe</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="col-lg-6">
                                                    <div className="mb-3">
                                                        <label htmlFor="countryOfNationality" className="form-label form-label">
                                                            Country of Nationality
                                                        </label>
                                                        <select className="form-select" id="countryOfNationality" name="countryOfNationality">
                                                            <option value="">Select country of nationality</option>
                                                            <option value="AF">Afghanistan</option>
                                                            <option value="AX">land Islands</option>
                                                            <option value="AL">Albania</option>
                                                            <option value="DZ">Algeria</option>
                                                            <option value="AS">American Samoa</option>
                                                            <option value="AD">AndorrA</option>
                                                            <option value="AO">Angola</option>
                                                            <option value="AI">Anguilla</option>
                                                            <option value="AQ">Antarctica</option>
                                                            <option value="AG">Antigua and Barbuda</option>
                                                            <option value="AR">Argentina</option>
                                                            <option value="AM">Armenia</option>
                                                            <option value="AW">Aruba</option>
                                                            <option value="AU">Australia</option>
                                                            <option value="AT">Austria</option>
                                                            <option value="AZ">Azerbaijan</option>
                                                            <option value="BS">Bahamas</option>
                                                            <option value="BH">Bahrain</option>
                                                            <option value="BD">Bangladesh</option>
                                                            <option value="BB">Barbados</option>
                                                            <option value="BY">Belarus</option>
                                                            <option value="BE">Belgium</option>
                                                            <option value="BZ">Belize</option>
                                                            <option value="BJ">Benin</option>
                                                            <option value="BM">Bermuda</option>
                                                            <option value="BT">Bhutan</option>
                                                            <option value="BO">Bolivia</option>
                                                            <option value="BA">Bosnia and Herzegovina</option>
                                                            <option value="BW">Botswana</option>
                                                            <option value="BV">Bouvet Island</option>
                                                            <option value="BR">Brazil</option>
                                                            <option value="IO">British Indian Ocean Territory</option>
                                                            <option value="BN">Brunei Darussalam</option>
                                                            <option value="BG">Bulgaria</option>
                                                            <option value="BF">Burkina Faso</option>
                                                            <option value="BI">Burundi</option>
                                                            <option value="KH">Cambodia</option>
                                                            <option value="CM">Cameroon</option>
                                                            <option value="CA">Canada</option>
                                                            <option value="CV">Cape Verde</option>
                                                            <option value="KY">Cayman Islands</option>
                                                            <option value="CF">Central African Republic</option>
                                                            <option value="TD">Chad</option>
                                                            <option value="CL">Chile</option>
                                                            <option value="CN">China</option>
                                                            <option value="CX">Christmas Island</option>
                                                            <option value="CC">Cocos (Keeling) Islands</option>
                                                            <option value="CO">Colombia</option>
                                                            <option value="KM">Comoros</option>
                                                            <option value="CG">Congo</option>
                                                            <option value="CD">Congo, The Democratic Republic of the</option>
                                                            <option value="CK">Cook Islands</option>
                                                            <option value="CR">Costa Rica</option>
                                                            <option value="CI">Cote D"Ivoire</option>
                                                            <option value="HR">Croatia</option>
                                                            <option value="CU">Cuba</option>
                                                            <option value="CY">Cyprus</option>
                                                            <option value="CZ">Czech Republic</option>
                                                            <option value="DK">Denmark</option>
                                                            <option value="DJ">Djibouti</option>
                                                            <option value="DM">Dominica</option>
                                                            <option value="DO">Dominican Republic</option>
                                                            <option value="EC">Ecuador</option>
                                                            <option value="EG">Egypt</option>
                                                            <option value="SV">El Salvador</option>
                                                            <option value="GQ">Equatorial Guinea</option>
                                                            <option value="ER">Eritrea</option>
                                                            <option value="EE">Estonia</option>
                                                            <option value="ET">Ethiopia</option>
                                                            <option value="FK">Falkland Islands (Malvinas)</option>
                                                            <option value="FO">Faroe Islands</option>
                                                            <option value="FJ">Fiji</option>
                                                            <option value="FI">Finland</option>
                                                            <option value="FR">France</option>
                                                            <option value="GF">French Guiana</option>
                                                            <option value="PF">French Polynesia</option>
                                                            <option value="TF">French Southern Territories</option>
                                                            <option value="GA">Gabon</option>
                                                            <option value="GM">Gambia</option>
                                                            <option value="GE">Georgia</option>
                                                            <option value="DE">Germany</option>
                                                            <option value="GH">Ghana</option>
                                                            <option value="GI">Gibraltar</option>
                                                            <option value="GR">Greece</option>
                                                            <option value="GL">Greenland</option>
                                                            <option value="GD">Grenada</option>
                                                            <option value="GP">Guadeloupe</option>
                                                            <option value="GU">Guam</option>
                                                            <option value="GT">Guatemala</option>
                                                            <option value="GG">Guernsey</option>
                                                            <option value="GN">Guinea</option>
                                                            <option value="GW">Guinea-Bissau</option>
                                                            <option value="GY">Guyana</option>
                                                            <option value="HT">Haiti</option>
                                                            <option value="HM">Heard Island and Mcdonald Islands</option>
                                                            <option value="VA">Holy See (Vatican City State)</option>
                                                            <option value="HN">Honduras</option>
                                                            <option value="HK">Hong Kong</option>
                                                            <option value="HU">Hungary</option>
                                                            <option value="IS">Iceland</option>
                                                            <option value="IN">India</option>
                                                            <option value="ID">Indonesia</option>
                                                            <option value="IR">Iran, Islamic Republic Of</option>
                                                            <option value="IQ">Iraq</option>
                                                            <option value="IE">Ireland</option>
                                                            <option value="IM">Isle of Man</option>
                                                            <option value="IL">Israel</option>
                                                            <option value="IT">Italy</option>
                                                            <option value="JM">Jamaica</option>
                                                            <option value="JP">Japan</option>
                                                            <option value="JE">Jersey</option>
                                                            <option value="JO">Jordan</option>
                                                            <option value="KZ">Kazakhstan</option>
                                                            <option value="KE">Kenya</option>
                                                            <option value="KI">Kiribati</option>
                                                            <option value="KP">Korea, Democratic People"S Republic of</option>
                                                            <option value="KR">Korea, Republic of</option>
                                                            <option value="KW">Kuwait</option>
                                                            <option value="KG">Kyrgyzstan</option>
                                                            <option value="LA">Lao People"S Democratic Republic</option>
                                                            <option value="LV">Latvia</option>
                                                            <option value="LB">Lebanon</option>
                                                            <option value="LS">Lesotho</option>
                                                            <option value="LR">Liberia</option>
                                                            <option value="LY">Libyan Arab Jamahiriya</option>
                                                            <option value="LI">Liechtenstein</option>
                                                            <option value="LT">Lithuania</option>
                                                            <option value="LU">Luxembourg</option>
                                                            <option value="MO">Macao</option>
                                                            <option value="MK">Macedonia, The Former Yugoslav Republic of</option>
                                                            <option value="MG">Madagascar</option>
                                                            <option value="MW">Malawi</option>
                                                            <option value="MY">Malaysia</option>
                                                            <option value="MV">Maldives</option>
                                                            <option value="ML">Mali</option>
                                                            <option value="MT">Malta</option>
                                                            <option value="MH">Marshall Islands</option>
                                                            <option value="MQ">Martinique</option>
                                                            <option value="MR">Mauritania</option>
                                                            <option value="MU">Mauritius</option>
                                                            <option value="YT">Mayotte</option>
                                                            <option value="MX">Mexico</option>
                                                            <option value="FM">Micronesia, Federated States of</option>
                                                            <option value="MD">Moldova, Republic of</option>
                                                            <option value="MC">Monaco</option>
                                                            <option value="MN">Mongolia</option>
                                                            <option value="ME">Montenegro</option>
                                                            <option value="MS">Montserrat</option>
                                                            <option value="MA">Morocco</option>
                                                            <option value="MZ">Mozambique</option>
                                                            <option value="MM">Myanmar</option>
                                                            <option value="NA">Namibia</option>
                                                            <option value="NR">Nauru</option>
                                                            <option value="NP">Nepal</option>
                                                            <option value="NL">Netherlands</option>
                                                            <option value="AN">Netherlands Antilles</option>
                                                            <option value="NC">New Caledonia</option>
                                                            <option value="NZ">New Zealand</option>
                                                            <option value="NI">Nicaragua</option>
                                                            <option value="NE">Niger</option>
                                                            <option value="NG">Nigeria</option>
                                                            <option value="NU">Niue</option>
                                                            <option value="NF">Norfolk Island</option>
                                                            <option value="MP">Northern Mariana Islands</option>
                                                            <option value="NO">Norway</option>
                                                            <option value="OM">Oman</option>
                                                            <option value="PK">Pakistan</option>
                                                            <option value="PW">Palau</option>
                                                            <option value="PS">Palestinian Territory, Occupied</option>
                                                            <option value="PA">Panama</option>
                                                            <option value="PG">Papua New Guinea</option>
                                                            <option value="PY">Paraguay</option>
                                                            <option value="PE">Peru</option>
                                                            <option value="PH">Philippines</option>
                                                            <option value="PN">Pitcairn</option>
                                                            <option value="PL">Poland</option>
                                                            <option value="PT">Portugal</option>
                                                            <option value="PR">Puerto Rico</option>
                                                            <option value="QA">Qatar</option>
                                                            <option value="RE">Reunion</option>
                                                            <option value="RO">Romania</option>
                                                            <option value="RU">Russian Federation</option>
                                                            <option value="RW">RWANDA</option>
                                                            <option value="SH">Saint Helena</option>
                                                            <option value="KN">Saint Kitts and Nevis</option>
                                                            <option value="LC">Saint Lucia</option>
                                                            <option value="PM">Saint Pierre and Miquelon</option>
                                                            <option value="VC">Saint Vincent and the Grenadines</option>
                                                            <option value="WS">Samoa</option>
                                                            <option value="SM">San Marino</option>
                                                            <option value="ST">Sao Tome and Principe</option>
                                                            <option value="SA">Saudi Arabia</option>
                                                            <option value="SN">Senegal</option>
                                                            <option value="RS">Serbia</option>
                                                            <option value="SC">Seychelles</option>
                                                            <option value="SL">Sierra Leone</option>
                                                            <option value="SG">Singapore</option>
                                                            <option value="SK">Slovakia</option>
                                                            <option value="SI">Slovenia</option>
                                                            <option value="SB">Solomon Islands</option>
                                                            <option value="SO">Somalia</option>
                                                            <option value="ZA">South Africa</option>
                                                            <option value="GS">South Georgia and the South Sandwich Islands</option>
                                                            <option value="ES">Spain</option>
                                                            <option value="LK">Sri Lanka</option>
                                                            <option value="SD">Sudan</option>
                                                            <option value="SR">Suriname</option>
                                                            <option value="SJ">Svalbard and Jan Mayen</option>
                                                            <option value="SZ">Swaziland</option>
                                                            <option value="SE">Sweden</option>
                                                            <option value="CH">Switzerland</option>
                                                            <option value="SY">Syrian Arab Republic</option>
                                                            <option value="TW">Taiwan, Province of China</option>
                                                            <option value="TJ">Tajikistan</option>
                                                            <option value="TZ">Tanzania, United Republic of</option>
                                                            <option value="TH">Thailand</option>
                                                            <option value="TL">Timor-Leste</option>
                                                            <option value="TG">Togo</option>
                                                            <option value="TK">Tokelau</option>
                                                            <option value="TO">Tonga</option>
                                                            <option value="TT">Trinidad and Tobago</option>
                                                            <option value="TN">Tunisia</option>
                                                            <option value="TR">Turkey</option>
                                                            <option value="TM">Turkmenistan</option>
                                                            <option value="TC">Turks and Caicos Islands</option>
                                                            <option value="TV">Tuvalu</option>
                                                            <option value="UG">Uganda</option>
                                                            <option value="UA">Ukraine</option>
                                                            <option value="AE">United Arab Emirates</option>
                                                            <option value="GB">United Kingdom</option>
                                                            <option value="US">United States</option>
                                                            <option value="UM">United States Minor Outlying Islands</option>
                                                            <option value="UY">Uruguay</option>
                                                            <option value="UZ">Uzbekistan</option>
                                                            <option value="VU">Vanuatu</option>
                                                            <option value="VE">Venezuela</option>
                                                            <option value="VN">Viet Nam</option>
                                                            <option value="VG">Virgin Islands, British</option>
                                                            <option value="VI">Virgin Islands, U.S.</option>
                                                            <option value="WF">Wallis and Futuna</option>
                                                            <option value="EH">Western Sahara</option>
                                                            <option value="YE">Yemen</option>
                                                            <option value="ZM">Zambia</option>
                                                            <option value="ZW">Zimbabwe</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="col-lg-12">
                                                    <h5 className="mt-4 mb-4">Additional Information</h5>
                                                </div>
                                                <div className="col-lg-6">
                                                    <div className="mb-3">
                                                        <label htmlFor="secondaryEmail" className="form-label form-label">
                                                            Secondary Email
                                                        </label>
                                                        <Input
                                                            id="secondaryEmail"
                                                            placeholder="Enter secondary email"
                                                            name="secondaryEmail"
                                                            type="email"
                                                            className="form-control"
                                                            value=""
                                                        ></Input>
                                                    </div>
                                                </div>
                                                <div className="col-lg-6">
                                                    <div className="mb-3">
                                                        <label htmlFor="secondaryPhoneNumber" className="form-label form-label">
                                                            Secondary Phone Number
                                                        </label>
                                                        <Input
                                                            id="secondaryPhoneNumber"
                                                            placeholder="Enter secondary phone number"
                                                            name="secondaryPhoneNumber"
                                                            type="tel"
                                                            className="form-control"
                                                            value=""
                                                        ></Input>
                                                    </div>
                                                </div>
                                                <div className="col-lg-12 mt-4 text-end">
                                                    <button type="submit" className="btn btn-primary">
                                                        Save Changes
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                    <div className="tab-pane">
                                        <form>
                                            <div className="row">
                                                <div className="col-lg-12">
                                                    <h5 className="mb-4">Area of Expertise</h5>
                                                </div>
                                                <div className="col-lg-6">
                                                    <div className="mb-3">
                                                        <label htmlFor="industry" className="form-label form-label">
                                                            Area of Expertise
                                                        </label>
                                                        <select className="form-select" id="industry" name="industry">
                                                            <option value="">Select Area</option>
                                                            <option value="2866f463-fd6e-4091-afb8-62362a207421">Accounting</option>
                                                            <option value="e05c3d14-eb46-47d1-9d9b-d72509c03dc7">Annual Reports</option>
                                                            <option value="c9d1cce2-30fc-464c-bab3-bf4cf6837bb8">Audiovisual</option>
                                                            <option value="9d0312b5-abad-45d8-b9c3-7149a1988cad">Automotive</option>
                                                            <option value="97519c74-92ea-46c3-a723-2c332e6bbea3" disabled={false}>
                                                                Business
                                                            </option>
                                                            <option value="1b67d8d7-2647-4993-8645-d6099dd3d318">Cell Phones</option>
                                                            <option value="ea6ac688-4237-4bfa-b6e8-0075c82d6e2a">Contracts</option>
                                                            <option value="21fcb4fc-e21d-42a3-be5b-0976c7ed2d30">Corporate</option>
                                                            <option value="96aaebec-7cfa-4697-be4b-53fa2a9e0472">Cosmetics</option>
                                                            <option value="6fff3c69-21ea-49ae-a9cc-b262a98329dd">Editorial</option>
                                                            <option value="25c5b4e9-458b-4ddf-9b08-b050b0f7929f" disabled={false}>
                                                                Education
                                                            </option>
                                                            <option value="79a5538f-966e-4ee7-8e80-8dd0f699158a">Electro Engineering</option>
                                                            <option value="d32d9927-7315-43a6-9b38-7b707139c74d">Entertainment</option>
                                                            <option value="c5b0d539-908f-43cf-863a-8f4d0fded6db">Finance</option>
                                                            <option value="470703e6-3c1b-425f-ad7d-865e7a098de6">IT</option>
                                                            <option value="e26e6bcb-1029-4110-9b03-5e39c729fb50">Insurance</option>
                                                            <option value="8667e9a7-e060-49a7-b491-29a67eb52767" disabled={false}>
                                                                Legal
                                                            </option>
                                                            <option value="05452902-c6d6-4852-9ae1-6e65b20019c8" disabled={false}>
                                                                Marketing
                                                            </option>
                                                            <option value="e1eb2450-a6d7-4d15-ad01-e423267e528f">Mechanical Engineering</option>
                                                            <option value="c774f908-1d3d-4498-8223-155f08e05f74" disabled={false}>
                                                                Medical Devices
                                                            </option>
                                                            <option value="ec06062b-126b-4629-a074-919852680cb5" disabled={false}>
                                                                Medical/Pharmaceutical
                                                            </option>
                                                            <option value="1f4606c6-0b01-4d9c-9e73-9f43e112b0ef">Patents</option>
                                                            <option value="b1af2fb7-53e8-4325-b267-c04ebc2b1eea" disabled={false}>
                                                                Software/App
                                                            </option>
                                                            <option value="36dc6191-e840-44f1-8fdf-678cc43927d5">Technical</option>
                                                            <option value="b57d3890-2a21-4727-9b4f-22c7c29df6de">Transport</option>
                                                            <option value="d680c710-e191-45f4-856d-183bd0a8d646" disabled={false}>
                                                                User Manuals
                                                            </option>
                                                            <option value="d66f5790-c544-4e5e-a695-c83d9332fedb" disabled={false}>
                                                                Website
                                                            </option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="col-lg-6">
                                                    <div className="mb-3">
                                                        <label htmlFor="yearsOfExperience" className="form-label form-label">
                                                            Years of Expertise
                                                        </label>
                                                        <Input
                                                            id="yearsOfExperience"
                                                            placeholder="Enter years of expertise"
                                                            name="yearsOfExperience"
                                                            type="number"
                                                            className="form-control"
                                                            value=""
                                                        ></Input>
                                                    </div>
                                                </div>
                                                <div className="col-lg-12 mb-4">
                                                    <button type="button" className="btn btn-soft-primary">
                                                        Add Expertise
                                                    </button>
                                                </div>
                                                <div className="col-lg-12">
                                                    <table className="table-borderless mb-4 table align-middle">
                                                        <thead className="table-light">
                                                            <tr>
                                                                <th>Area of Expertise</th>
                                                                <th>Years of Experience</th>
                                                                <th>Actions</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                <td>Medical/Pharmaceutical</td>
                                                                <td>34</td>
                                                                <td>
                                                                    <button type="button" className="btn btn-soft-danger btn-sm">
                                                                        Remove
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>Medical Devices</td>
                                                                <td>34</td>
                                                                <td>
                                                                    <button type="button" className="btn btn-soft-danger btn-sm">
                                                                        Remove
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>Business</td>
                                                                <td>34</td>
                                                                <td>
                                                                    <button type="button" className="btn btn-soft-danger btn-sm">
                                                                        Remove
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>Legal</td>
                                                                <td>34</td>
                                                                <td>
                                                                    <button type="button" className="btn btn-soft-danger btn-sm">
                                                                        Remove
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>Education</td>
                                                                <td>34</td>
                                                                <td>
                                                                    <button type="button" className="btn btn-soft-danger btn-sm">
                                                                        Remove
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>Marketing</td>
                                                                <td>34</td>
                                                                <td>
                                                                    <button type="button" className="btn btn-soft-danger btn-sm">
                                                                        Remove
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>Software/App</td>
                                                                <td>34</td>
                                                                <td>
                                                                    <button type="button" className="btn btn-soft-danger btn-sm">
                                                                        Remove
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>User Manuals</td>
                                                                <td>34</td>
                                                                <td>
                                                                    <button type="button" className="btn btn-soft-danger btn-sm">
                                                                        Remove
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>Website</td>
                                                                <td>20</td>
                                                                <td>
                                                                    <button type="button" className="btn btn-soft-danger btn-sm">
                                                                        Remove
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </form>
                                        <form>
                                            <div className="row">
                                                <div className="col-lg-12">
                                                    <h5 className="mb-4">Translation Tools</h5>
                                                </div>
                                                <div className="col-lg-12">
                                                    <div className="mb-3">
                                                        <label htmlFor="tool" className="form-label form-label">
                                                            Tool Name
                                                        </label>
                                                        <select className="form-select" id="tool" name="tool">
                                                            <option value="">Select Tool</option>
                                                            <option value="Aegisub">Aegisub</option>
                                                            <option value="Alchemy Catalyst">Alchemy Catalyst</option>
                                                            <option value="Crowdin" disabled={false}>
                                                                Crowdin
                                                            </option>
                                                            <option value="EZTitles">EZTitles</option>
                                                            <option value="Helium">Helium</option>
                                                            <option value="Idiom WorldServer">Idiom WorldServer</option>
                                                            <option value="Lingotek">Lingotek</option>
                                                            <option value="LocStudio">LocStudio</option>
                                                            <option value="Lokalise">Lokalise</option>
                                                            <option value="MateCat">MateCat</option>
                                                            <option value="MemoQ" disabled={false}>
                                                                MemoQ
                                                            </option>
                                                            <option value="Memsource" disabled={false}>
                                                                Memsource
                                                            </option>
                                                            <option value="Not Applicable (NA)">Not Applicable (NA)</option>
                                                            <option value="Ontram">Ontram</option>
                                                            <option value="Other">Other</option>
                                                            <option value="Passolo">Passolo</option>
                                                            <option value="Phrase" disabled={false}>
                                                                Phrase
                                                            </option>
                                                            <option value="Plunet" disabled={false}>
                                                                Plunet
                                                            </option>
                                                            <option value="SDL MultiTerm" disabled={false}>
                                                                SDL MultiTerm
                                                            </option>
                                                            <option value="SDL Trados Studio" disabled={false}>
                                                                SDL Trados Studio
                                                            </option>
                                                            <option value="Smartcat">Smartcat</option>
                                                            <option value="Smartling">Smartling</option>
                                                            <option value="Subtitle Edit">Subtitle Edit</option>
                                                            <option value="Trados" disabled={false}>
                                                                Trados
                                                            </option>
                                                            <option value="Wordbee">Wordbee</option>
                                                            <option value="Wordfast" disabled={false}>
                                                                Wordfast
                                                            </option>
                                                            <option value="Workspace">Workspace</option>
                                                            <option value="XTM" disabled={false}>
                                                                XTM
                                                            </option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="col-lg-12 mb-4">
                                                    <button type="button" className="btn btn-soft-primary">
                                                        Add Tool
                                                    </button>
                                                </div>
                                                <div className="col-lg-12">
                                                    <table className="table-borderless mb-0 table align-middle">
                                                        <thead className="table-light">
                                                            <tr>
                                                                <th>Tool Name</th>
                                                                <th>Actions</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                <td>Wordfast</td>
                                                                <td>
                                                                    <button type="button" className="btn btn-soft-danger btn-sm">
                                                                        Remove
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>SDL Trados Studio</td>
                                                                <td>
                                                                    <button type="button" className="btn btn-soft-danger btn-sm">
                                                                        Remove
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>MemoQ</td>
                                                                <td>
                                                                    <button type="button" className="btn btn-soft-danger btn-sm">
                                                                        Remove
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>Crowdin</td>
                                                                <td>
                                                                    <button type="button" className="btn btn-soft-danger btn-sm">
                                                                        Remove
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>Memsource</td>
                                                                <td>
                                                                    <button type="button" className="btn btn-soft-danger btn-sm">
                                                                        Remove
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>Phrase</td>
                                                                <td>
                                                                    <button type="button" className="btn btn-soft-danger btn-sm">
                                                                        Remove
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>Plunet</td>
                                                                <td>
                                                                    <button type="button" className="btn btn-soft-danger btn-sm">
                                                                        Remove
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>SDL MultiTerm</td>
                                                                <td>
                                                                    <button type="button" className="btn btn-soft-danger btn-sm">
                                                                        Remove
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>XTM</td>
                                                                <td>
                                                                    <button type="button" className="btn btn-soft-danger btn-sm">
                                                                        Remove
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                    <div className="tab-pane">
                                        <form>
                                            <div className="row">
                                                <div className="col-lg-12">
                                                    <h5 className="mb-4">Language Pairs and Rates</h5>
                                                </div>
                                                <div className="col-lg-6">
                                                    <div className="mb-3">
                                                        <label htmlFor="sourceLanguage" className="form-label form-label">
                                                            Source Language
                                                        </label>
                                                        <select className="form-select" id="sourceLanguage" name="sourceLanguage">
                                                            <option value="">Select Source Language</option>
                                                            <option value="330a47f3-a281-49bf-9bbb-4fcb4e124ec8">Afrikaans (AF)</option>
                                                            <option value="0a1b3208-46cf-4d15-ab3d-57227902fd0b">Albanian (SQ)</option>
                                                            <option value="07ca105c-2ff1-499a-a065-64347e83a93c">Amharic (AM)</option>
                                                            <option value="1cf99669-de32-4c37-a6b6-e0bd9b711488">Arabic (AR)</option>
                                                            <option value="f77c6574-eb0d-4f0e-a88e-2874395173a9">Armenian (HY)</option>
                                                            <option value="dd1e519c-8c45-4b97-a908-01186bd0f4a9">Azerbaijani (AZ)</option>
                                                            <option value="6465124e-9b40-4933-9db3-793e6d125631">Basque (EU)</option>
                                                            <option value="95f846ab-3de1-4135-abc8-c625937c14bd">Belarusian (BE)</option>
                                                            <option value="c5780f42-2738-4a39-aa13-2a69139e77ae">Bengali (BN)</option>
                                                            <option value="15eba54e-d6ea-4cf9-b017-4a266db2cd90">Bhutanese (BT)</option>
                                                            <option value="aa0abad5-1ec7-4a65-ac7c-59d165e4db60">Bihari (BH)</option>
                                                            <option value="231c62a6-48bf-4fe9-966f-b4532190b66e">Bosnian (BS)</option>
                                                            <option value="c25b897a-93ce-4b7b-8114-0377bafa3875">Breton (BR)</option>
                                                            <option value="403cf19c-73c9-4b23-bb89-845b7e65c556">Bulgarian (BG)</option>
                                                            <option value="1f9d94f4-448b-4a52-8a20-9a64e1044203">Burmese (MY)</option>
                                                            <option value="97657707-4d71-4ef5-8f0e-aa7beb97a28b">Catalan (CA)</option>
                                                            <option value="e3a48dde-4710-48e7-ad8b-f1f5e5401df1">Chinese, Hong Kong (ZH)</option>
                                                            <option value="d7161b28-2e1d-4626-a1d1-3f2c0b885edb">Chinese, Simplified (ZS)</option>
                                                            <option value="4fae5c30-58d4-49d1-a364-205e50cf51f3">Chinese, Traditional (ZT)</option>
                                                            <option value="cdd94b4a-7f9c-4510-b0e5-0cca90e2087c">Croatian (HR)</option>
                                                            <option value="2f9823d6-43a8-49d3-9ad8-38dbd851eb3b">Czech (cs)</option>
                                                            <option value="85d024fc-0e17-4cb8-ba77-e6784839af43">Danish (DA)</option>
                                                            <option value="bbd1db4a-8173-4d41-b85e-01321f3447b0">Dutch (NL)</option>
                                                            <option value="c140505f-e72c-451d-beef-91d91f2539f3">English (EN)</option>
                                                            <option value="059d0159-b1dc-41f2-908c-8bf364072b29">English, Australian (AE)</option>
                                                            <option value="03941f05-230b-4e52-9f0e-3b16dffafd22">English, Canadian (CE)</option>
                                                            <option value="f1b24fc8-bd89-4f1e-ac2e-2049c62b824f">Estonian (ET)</option>
                                                            <option value="c7f482a1-9fe5-476c-a32b-e9a4cbe55ef2">Faroese (FO)</option>
                                                            <option value="5c70b49d-cc32-4928-8bec-68ea1b25469b">Filipino (TL)</option>
                                                            <option value="96878048-5076-4d79-bad2-6cc230ac30ec">Finnish (FI)</option>
                                                            <option value="5c9acd53-cb38-4f91-a92a-65121bc543bc">French (FR)</option>
                                                            <option value="a8fdeba1-5f87-4394-8603-70167f09691c">French, Canadian (CF)</option>
                                                            <option value="b36de009-1b16-49ce-8701-8192c771f286">Frisian (FY)</option>
                                                            <option value="62a78f68-2f47-421f-8c00-94eef3b63ef7">Galician (GL)</option>
                                                            <option value="3ffd235b-d1aa-4a5a-8402-ded19311fe5a">Georgian (KA)</option>
                                                            <option value="1363d7f8-06fb-4f8d-9a91-8547c944efba">German (DE)</option>
                                                            <option value="47b1d1d8-b695-4dda-85a7-35dea99615f0">Greek (EL)</option>
                                                            <option value="3fbbb37c-7ac9-4651-bfcd-ef5177c656af">Guarani (GN)</option>
                                                            <option value="e7a95dec-3aec-4899-9449-06a71ae8c219">Gujarati (GU)</option>
                                                            <option value="e54b60bf-3717-4de3-9fb4-fe4f134177a4">Hausa (HA)</option>
                                                            <option value="4bf246f0-b986-41e4-a4e0-ab06b828259f">Hawaiian (HW)</option>
                                                            <option value="51160107-1830-4f21-8ad3-9e34b4eaaeda">Hebrew (IW)</option>
                                                            <option value="3da24caa-50ad-441e-a21b-a3fd5edecb71">Hindi (HI)</option>
                                                            <option value="a92fc44e-ef54-469c-b0b8-e714bec960cb">Hungarian (HU)</option>
                                                            <option value="6439bd5a-f3c5-4b34-adb4-e8d5168cf28c">Icelandic (IS)</option>
                                                            <option value="269a8b30-f1b6-4dac-ac05-329b5f22be40">Igbo (IG)</option>
                                                            <option value="5b8c0dcf-d3ad-492e-b959-66f61874ccfd">Indonesian (ID)</option>
                                                            <option value="e1f34cb6-46df-4fb4-ae1c-ccf50af8bc45">Interlingua (IA)</option>
                                                            <option value="88d7fea5-9f50-4a4b-beac-a7f19dbeed2b">Irish (GA)</option>
                                                            <option value="e3782022-5eda-48dc-9f15-a4ae360f53bc">Italian (IT)</option>
                                                            <option value="d84ea8a6-ef30-4b86-b735-7b2a5a925df2">Japanese (JA)</option>
                                                            <option value="82a93fd8-e0c0-4972-9f60-838a535ec695">Javanese (JW)</option>
                                                            <option value="a4cf31dd-3efb-49cb-8f8a-7180b948dee0">Kannada (KN)</option>
                                                            <option value="1e374ca7-2a7b-4530-a0c3-cee5cdad87de">Kashmiri (KS)</option>
                                                            <option value="730ba970-34d2-4620-9bd8-a09bca638ae1">Kazakh (KK)</option>
                                                            <option value="420f94a0-857c-4358-9196-d622632ee5e7">Khmer (KM)</option>
                                                            <option value="10f27ade-d5f9-40a7-942f-2d412a36f0ec">Kirundi (RN)</option>
                                                            <option value="c3417257-732d-46b6-b52b-4e40bd666fba">Korean (KO)</option>
                                                            <option value="6914574a-186a-4dd1-b06b-3996e5a57605">Kurdish (KU)</option>
                                                            <option value="417cf3ef-0d51-4985-99f4-a2a730390962">Laothian (LO)</option>
                                                            <option value="ed163d68-fbb5-465d-ae32-edd16a88ad00">Latin (LA)</option>
                                                            <option value="902f14ba-235c-4776-8cba-ea4b04b318dc">Latvian (LV)</option>
                                                            <option value="7c3eda68-fdac-41c2-8693-5193f8dbfa23">Lingala (LN)</option>
                                                            <option value="694b0474-42d2-4022-a74a-98e4e13e8567">Lithuanian (LT)</option>
                                                            <option value="46386af0-b71e-4e4a-abfe-c87244f53267">Luganda (LG)</option>
                                                            <option value="096e533b-35e7-4ce1-80b3-fe3cab99dc91">Macedonian (MK)</option>
                                                            <option value="bb1e2bc7-881a-48cf-ae42-8337c38f9473">Malagasy (MG)</option>
                                                            <option value="eb4a4f1d-bd78-4e94-b089-6763c940e51f">Malay (MS)</option>
                                                            <option value="cb9b1581-ae90-4e33-a123-a6e2ba43e893">Malayalam (ML)</option>
                                                            <option value="10448e2d-9377-49f8-9118-62b025a58cd7">Maltese (MT)</option>
                                                            <option value="f18d19db-d9f3-41f2-8ddd-0a2271e18d38">Maori (MI)</option>
                                                            <option value="5d608bf3-84fa-4585-b24b-abb2851d339b">Marathi (MR)</option>
                                                            <option value="f2006c10-e70d-4823-b787-d6f25c4109fb">Moldavian (MO)</option>
                                                            <option value="09fe433a-df06-453f-9152-a107e077e9fc">Mongolian (MN)</option>
                                                            <option value="1b6e3d2e-437f-4b61-84d6-7f2ca0c6a0c7">Montenegrin (ME)</option>
                                                            <option value="a9ae6589-b986-4d10-851b-d0b182f10f5d">Nepali (NE)</option>
                                                            <option value="dcd86ebe-6290-4152-ae37-f54a7714af83">Norwegian (NO)</option>
                                                            <option value="0a4c02c5-3d7b-4a1a-8593-64ae2d9fd9b3">Norwegian Nynorsk (NN)</option>
                                                            <option value="3a658ef6-5d18-4461-8932-c6d94dea3997">Pashto (PS)</option>
                                                            <option value="b2382dc3-de7d-4133-8dc0-c223ffd3a3f4">Persian (FA)</option>
                                                            <option value="337fc83f-1376-4915-9b50-395b0c5cf42e">Persian, Dari (DR)</option>
                                                            <option value="85f14048-0e6c-4cfb-b1f8-821a37fc31ab">Polish (PL)</option>
                                                            <option value="1fc68879-6668-49e5-a8a8-d414386ada62">Portuguese (PT)</option>
                                                            <option value="970b37fb-10b0-4811-b7d3-cf883de8e2a8">Portuguese, Brazilian (PB)</option>
                                                            <option value="7b69ffac-5218-47e4-b805-e8f3a8aa3bbb">Punjabi (PA)</option>
                                                            <option value="0baf103b-e8db-4cf1-bc37-bc13ea96dfbe">Romanian (RO)</option>
                                                            <option value="63be0ee0-6197-4ebf-a388-df717a83e96b">Russian (RU)</option>
                                                            <option value="12b40fb5-a3c0-4b13-9c5e-f4bb57cd1034">Rwandan (RW)</option>
                                                            <option value="b4aa1fb6-deff-421a-9f88-6ac2b06c1316">Scots Gaelic (GD)</option>
                                                            <option value="8113f4c0-e242-4f6c-b1d3-00513e6bec56">Serbian (SR)</option>
                                                            <option value="020ac32c-9927-4d8d-bbd4-ab2a018db7f3">Sesotho (ST)</option>
                                                            <option value="165f59d4-ffbd-4301-9d42-468371b0fc88">Shona (SN)</option>
                                                            <option value="355c53af-78c2-448a-aed6-a583aa98f630">Slovak (SK)</option>
                                                            <option value="a08c6c23-4620-44cc-83b6-595dca6e010b">Slovenian (SL)</option>
                                                            <option value="d88e032c-d1f7-40f9-9994-d518937ee43a">Somali (so)</option>
                                                            <option value="39d1b7b8-9662-4b6a-9c35-74e903f535b4">Spanish (ES)</option>
                                                            <option value="1d8eb06d-631f-460d-8407-e4101ea6aeae">Spanish, Latin American (XL)</option>
                                                            <option value="02aec1ce-e1bb-4dc9-9b67-6aa6e56fd51f">Sundanese (SU)</option>
                                                            <option value="a515a972-e8a5-4dbd-9a19-415b2f5311b4">Swahili (SW)</option>
                                                            <option value="3c0617ec-2cad-45d3-9dde-467ce055e004">Swedish (sv)</option>
                                                            <option value="3d817ee3-e1c3-4d6f-ae68-b52210c9bfd5">Tajik (TG)</option>
                                                            <option value="46af6132-b0a4-4350-90c4-ebdaf93f30bc">Tamil (TA)</option>
                                                            <option value="1dccec5e-0670-4ea3-83fa-dfefbe31eb68">Tanchangya (TC)</option>
                                                            <option value="279ef980-0aad-4bbe-96a2-d5c75e533068">Telugu (TE)</option>
                                                            <option value="6a8c2ce5-96fb-458c-ad44-edc1b44ae37e">Thai (TH)</option>
                                                            <option value="e62e34bf-4db0-4303-ab3f-cec2e9eebd65">Tibetan (BO)</option>
                                                            <option value="127f52b0-ed0f-43be-8f01-840fb4e67d2f">Tonga (TO)</option>
                                                            <option value="6e180b8e-20fd-40e9-8fd1-83a369ecd32d">Tswana (TN)</option>
                                                            <option value="036e5f0f-3a61-4568-9e8a-f902676ac2df">Turkish (TR)</option>
                                                            <option value="17e23f06-0f9a-4810-ab58-b868a6847e31">Uighur (UG)</option>
                                                            <option value="50927751-48ad-4208-92ad-81a1bb03a6e9">Ukrainian (UK)</option>
                                                            <option value="106d8d70-c9c8-47e1-bac0-99380abc4ec7">Urdu (UR)</option>
                                                            <option value="bbc16d0c-3a1e-43a4-aaba-67904b18c65f">Uzbek (UZ)</option>
                                                            <option value="67d934c3-fe42-4241-8b92-29570d5cd4ca">Valencian (VA)</option>
                                                            <option value="2f00c914-4f02-4f42-8798-5889f8864912">Vietnamese (VI)</option>
                                                            <option value="b7cc11a8-169a-4374-a199-9bf65a205446">Welsh (CY)</option>
                                                            <option value="3da3f833-3ba6-421d-8959-636173bdb89d">Yiddish (YI)</option>
                                                            <option value="5a3ff13c-407c-4ce9-9001-9c2aa6de5d53">Yoruba (YO)</option>
                                                            <option value="635c4676-f342-4928-adf9-8bbf646295cb">Zulu (ZU)</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="col-lg-6">
                                                    <div className="mb-3">
                                                        <label htmlFor="targetLanguage" className="form-label form-label">
                                                            Target Language
                                                        </label>
                                                        <select className="form-select" id="targetLanguage" name="targetLanguage">
                                                            <option value="">Select Target Language</option>
                                                            <option value="330a47f3-a281-49bf-9bbb-4fcb4e124ec8">Afrikaans (AF)</option>
                                                            <option value="0a1b3208-46cf-4d15-ab3d-57227902fd0b">Albanian (SQ)</option>
                                                            <option value="07ca105c-2ff1-499a-a065-64347e83a93c">Amharic (AM)</option>
                                                            <option value="1cf99669-de32-4c37-a6b6-e0bd9b711488">Arabic (AR)</option>
                                                            <option value="f77c6574-eb0d-4f0e-a88e-2874395173a9">Armenian (HY)</option>
                                                            <option value="dd1e519c-8c45-4b97-a908-01186bd0f4a9">Azerbaijani (AZ)</option>
                                                            <option value="6465124e-9b40-4933-9db3-793e6d125631">Basque (EU)</option>
                                                            <option value="95f846ab-3de1-4135-abc8-c625937c14bd">Belarusian (BE)</option>
                                                            <option value="c5780f42-2738-4a39-aa13-2a69139e77ae">Bengali (BN)</option>
                                                            <option value="15eba54e-d6ea-4cf9-b017-4a266db2cd90">Bhutanese (BT)</option>
                                                            <option value="aa0abad5-1ec7-4a65-ac7c-59d165e4db60">Bihari (BH)</option>
                                                            <option value="231c62a6-48bf-4fe9-966f-b4532190b66e">Bosnian (BS)</option>
                                                            <option value="c25b897a-93ce-4b7b-8114-0377bafa3875">Breton (BR)</option>
                                                            <option value="403cf19c-73c9-4b23-bb89-845b7e65c556">Bulgarian (BG)</option>
                                                            <option value="1f9d94f4-448b-4a52-8a20-9a64e1044203">Burmese (MY)</option>
                                                            <option value="97657707-4d71-4ef5-8f0e-aa7beb97a28b">Catalan (CA)</option>
                                                            <option value="e3a48dde-4710-48e7-ad8b-f1f5e5401df1">Chinese, Hong Kong (ZH)</option>
                                                            <option value="d7161b28-2e1d-4626-a1d1-3f2c0b885edb">Chinese, Simplified (ZS)</option>
                                                            <option value="4fae5c30-58d4-49d1-a364-205e50cf51f3">Chinese, Traditional (ZT)</option>
                                                            <option value="cdd94b4a-7f9c-4510-b0e5-0cca90e2087c">Croatian (HR)</option>
                                                            <option value="2f9823d6-43a8-49d3-9ad8-38dbd851eb3b">Czech (cs)</option>
                                                            <option value="85d024fc-0e17-4cb8-ba77-e6784839af43">Danish (DA)</option>
                                                            <option value="bbd1db4a-8173-4d41-b85e-01321f3447b0">Dutch (NL)</option>
                                                            <option value="c140505f-e72c-451d-beef-91d91f2539f3">English (EN)</option>
                                                            <option value="059d0159-b1dc-41f2-908c-8bf364072b29">English, Australian (AE)</option>
                                                            <option value="03941f05-230b-4e52-9f0e-3b16dffafd22">English, Canadian (CE)</option>
                                                            <option value="f1b24fc8-bd89-4f1e-ac2e-2049c62b824f">Estonian (ET)</option>
                                                            <option value="c7f482a1-9fe5-476c-a32b-e9a4cbe55ef2">Faroese (FO)</option>
                                                            <option value="5c70b49d-cc32-4928-8bec-68ea1b25469b">Filipino (TL)</option>
                                                            <option value="96878048-5076-4d79-bad2-6cc230ac30ec">Finnish (FI)</option>
                                                            <option value="5c9acd53-cb38-4f91-a92a-65121bc543bc">French (FR)</option>
                                                            <option value="a8fdeba1-5f87-4394-8603-70167f09691c">French, Canadian (CF)</option>
                                                            <option value="b36de009-1b16-49ce-8701-8192c771f286">Frisian (FY)</option>
                                                            <option value="62a78f68-2f47-421f-8c00-94eef3b63ef7">Galician (GL)</option>
                                                            <option value="3ffd235b-d1aa-4a5a-8402-ded19311fe5a">Georgian (KA)</option>
                                                            <option value="1363d7f8-06fb-4f8d-9a91-8547c944efba">German (DE)</option>
                                                            <option value="47b1d1d8-b695-4dda-85a7-35dea99615f0">Greek (EL)</option>
                                                            <option value="3fbbb37c-7ac9-4651-bfcd-ef5177c656af">Guarani (GN)</option>
                                                            <option value="e7a95dec-3aec-4899-9449-06a71ae8c219">Gujarati (GU)</option>
                                                            <option value="e54b60bf-3717-4de3-9fb4-fe4f134177a4">Hausa (HA)</option>
                                                            <option value="4bf246f0-b986-41e4-a4e0-ab06b828259f">Hawaiian (HW)</option>
                                                            <option value="51160107-1830-4f21-8ad3-9e34b4eaaeda">Hebrew (IW)</option>
                                                            <option value="3da24caa-50ad-441e-a21b-a3fd5edecb71">Hindi (HI)</option>
                                                            <option value="a92fc44e-ef54-469c-b0b8-e714bec960cb">Hungarian (HU)</option>
                                                            <option value="6439bd5a-f3c5-4b34-adb4-e8d5168cf28c">Icelandic (IS)</option>
                                                            <option value="269a8b30-f1b6-4dac-ac05-329b5f22be40">Igbo (IG)</option>
                                                            <option value="5b8c0dcf-d3ad-492e-b959-66f61874ccfd">Indonesian (ID)</option>
                                                            <option value="e1f34cb6-46df-4fb4-ae1c-ccf50af8bc45">Interlingua (IA)</option>
                                                            <option value="88d7fea5-9f50-4a4b-beac-a7f19dbeed2b">Irish (GA)</option>
                                                            <option value="e3782022-5eda-48dc-9f15-a4ae360f53bc">Italian (IT)</option>
                                                            <option value="d84ea8a6-ef30-4b86-b735-7b2a5a925df2">Japanese (JA)</option>
                                                            <option value="82a93fd8-e0c0-4972-9f60-838a535ec695">Javanese (JW)</option>
                                                            <option value="a4cf31dd-3efb-49cb-8f8a-7180b948dee0">Kannada (KN)</option>
                                                            <option value="1e374ca7-2a7b-4530-a0c3-cee5cdad87de">Kashmiri (KS)</option>
                                                            <option value="730ba970-34d2-4620-9bd8-a09bca638ae1">Kazakh (KK)</option>
                                                            <option value="420f94a0-857c-4358-9196-d622632ee5e7">Khmer (KM)</option>
                                                            <option value="10f27ade-d5f9-40a7-942f-2d412a36f0ec">Kirundi (RN)</option>
                                                            <option value="c3417257-732d-46b6-b52b-4e40bd666fba">Korean (KO)</option>
                                                            <option value="6914574a-186a-4dd1-b06b-3996e5a57605">Kurdish (KU)</option>
                                                            <option value="417cf3ef-0d51-4985-99f4-a2a730390962">Laothian (LO)</option>
                                                            <option value="ed163d68-fbb5-465d-ae32-edd16a88ad00">Latin (LA)</option>
                                                            <option value="902f14ba-235c-4776-8cba-ea4b04b318dc">Latvian (LV)</option>
                                                            <option value="7c3eda68-fdac-41c2-8693-5193f8dbfa23">Lingala (LN)</option>
                                                            <option value="694b0474-42d2-4022-a74a-98e4e13e8567">Lithuanian (LT)</option>
                                                            <option value="46386af0-b71e-4e4a-abfe-c87244f53267">Luganda (LG)</option>
                                                            <option value="096e533b-35e7-4ce1-80b3-fe3cab99dc91">Macedonian (MK)</option>
                                                            <option value="bb1e2bc7-881a-48cf-ae42-8337c38f9473">Malagasy (MG)</option>
                                                            <option value="eb4a4f1d-bd78-4e94-b089-6763c940e51f">Malay (MS)</option>
                                                            <option value="cb9b1581-ae90-4e33-a123-a6e2ba43e893">Malayalam (ML)</option>
                                                            <option value="10448e2d-9377-49f8-9118-62b025a58cd7">Maltese (MT)</option>
                                                            <option value="f18d19db-d9f3-41f2-8ddd-0a2271e18d38">Maori (MI)</option>
                                                            <option value="5d608bf3-84fa-4585-b24b-abb2851d339b">Marathi (MR)</option>
                                                            <option value="f2006c10-e70d-4823-b787-d6f25c4109fb">Moldavian (MO)</option>
                                                            <option value="09fe433a-df06-453f-9152-a107e077e9fc">Mongolian (MN)</option>
                                                            <option value="1b6e3d2e-437f-4b61-84d6-7f2ca0c6a0c7">Montenegrin (ME)</option>
                                                            <option value="a9ae6589-b986-4d10-851b-d0b182f10f5d">Nepali (NE)</option>
                                                            <option value="dcd86ebe-6290-4152-ae37-f54a7714af83">Norwegian (NO)</option>
                                                            <option value="0a4c02c5-3d7b-4a1a-8593-64ae2d9fd9b3">Norwegian Nynorsk (NN)</option>
                                                            <option value="3a658ef6-5d18-4461-8932-c6d94dea3997">Pashto (PS)</option>
                                                            <option value="b2382dc3-de7d-4133-8dc0-c223ffd3a3f4">Persian (FA)</option>
                                                            <option value="337fc83f-1376-4915-9b50-395b0c5cf42e">Persian, Dari (DR)</option>
                                                            <option value="85f14048-0e6c-4cfb-b1f8-821a37fc31ab">Polish (PL)</option>
                                                            <option value="1fc68879-6668-49e5-a8a8-d414386ada62">Portuguese (PT)</option>
                                                            <option value="970b37fb-10b0-4811-b7d3-cf883de8e2a8">Portuguese, Brazilian (PB)</option>
                                                            <option value="7b69ffac-5218-47e4-b805-e8f3a8aa3bbb">Punjabi (PA)</option>
                                                            <option value="0baf103b-e8db-4cf1-bc37-bc13ea96dfbe">Romanian (RO)</option>
                                                            <option value="63be0ee0-6197-4ebf-a388-df717a83e96b">Russian (RU)</option>
                                                            <option value="12b40fb5-a3c0-4b13-9c5e-f4bb57cd1034">Rwandan (RW)</option>
                                                            <option value="b4aa1fb6-deff-421a-9f88-6ac2b06c1316">Scots Gaelic (GD)</option>
                                                            <option value="8113f4c0-e242-4f6c-b1d3-00513e6bec56">Serbian (SR)</option>
                                                            <option value="020ac32c-9927-4d8d-bbd4-ab2a018db7f3">Sesotho (ST)</option>
                                                            <option value="165f59d4-ffbd-4301-9d42-468371b0fc88">Shona (SN)</option>
                                                            <option value="355c53af-78c2-448a-aed6-a583aa98f630">Slovak (SK)</option>
                                                            <option value="a08c6c23-4620-44cc-83b6-595dca6e010b">Slovenian (SL)</option>
                                                            <option value="d88e032c-d1f7-40f9-9994-d518937ee43a">Somali (so)</option>
                                                            <option value="39d1b7b8-9662-4b6a-9c35-74e903f535b4">Spanish (ES)</option>
                                                            <option value="1d8eb06d-631f-460d-8407-e4101ea6aeae">Spanish, Latin American (XL)</option>
                                                            <option value="02aec1ce-e1bb-4dc9-9b67-6aa6e56fd51f">Sundanese (SU)</option>
                                                            <option value="a515a972-e8a5-4dbd-9a19-415b2f5311b4">Swahili (SW)</option>
                                                            <option value="3c0617ec-2cad-45d3-9dde-467ce055e004">Swedish (sv)</option>
                                                            <option value="3d817ee3-e1c3-4d6f-ae68-b52210c9bfd5">Tajik (TG)</option>
                                                            <option value="46af6132-b0a4-4350-90c4-ebdaf93f30bc">Tamil (TA)</option>
                                                            <option value="1dccec5e-0670-4ea3-83fa-dfefbe31eb68">Tanchangya (TC)</option>
                                                            <option value="279ef980-0aad-4bbe-96a2-d5c75e533068">Telugu (TE)</option>
                                                            <option value="6a8c2ce5-96fb-458c-ad44-edc1b44ae37e">Thai (TH)</option>
                                                            <option value="e62e34bf-4db0-4303-ab3f-cec2e9eebd65">Tibetan (BO)</option>
                                                            <option value="127f52b0-ed0f-43be-8f01-840fb4e67d2f">Tonga (TO)</option>
                                                            <option value="6e180b8e-20fd-40e9-8fd1-83a369ecd32d">Tswana (TN)</option>
                                                            <option value="036e5f0f-3a61-4568-9e8a-f902676ac2df">Turkish (TR)</option>
                                                            <option value="17e23f06-0f9a-4810-ab58-b868a6847e31">Uighur (UG)</option>
                                                            <option value="50927751-48ad-4208-92ad-81a1bb03a6e9">Ukrainian (UK)</option>
                                                            <option value="106d8d70-c9c8-47e1-bac0-99380abc4ec7">Urdu (UR)</option>
                                                            <option value="bbc16d0c-3a1e-43a4-aaba-67904b18c65f">Uzbek (UZ)</option>
                                                            <option value="67d934c3-fe42-4241-8b92-29570d5cd4ca">Valencian (VA)</option>
                                                            <option value="2f00c914-4f02-4f42-8798-5889f8864912">Vietnamese (VI)</option>
                                                            <option value="b7cc11a8-169a-4374-a199-9bf65a205446">Welsh (CY)</option>
                                                            <option value="3da3f833-3ba6-421d-8959-636173bdb89d">Yiddish (YI)</option>
                                                            <option value="5a3ff13c-407c-4ce9-9001-9c2aa6de5d53">Yoruba (YO)</option>
                                                            <option value="635c4676-f342-4928-adf9-8bbf646295cb">Zulu (ZU)</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="col-lg-4">
                                                    <div className="mb-3">
                                                        <label htmlFor="languageService" className="form-label form-label">
                                                            Language Service
                                                        </label>
                                                        <select className="form-select" id="languageService" name="languageService">
                                                            <option value="">Select Service</option>
                                                            <option value="da6fb166-c8f1-4b60-956f-67de939cc3aa">Audio Transcription</option>
                                                            <option value="e7ea2ea3-44fa-43c5-8945-c961b3b8de6e">Certified/Sworn/Notarised</option>
                                                            <option value="5f7f7250-a01d-4dc8-b175-2bde324d89f5">Pdf Check</option>
                                                            <option value="5b018404-d6f2-4a70-86d6-7106aeb814be">Revision</option>
                                                            <option value="94744f79-7647-4a7d-8315-90905559d61d">Subtitling</option>
                                                            <option value="f95dd42d-011e-4a97-a3a4-3e6ab447e18b">Translation</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="col-lg-4">
                                                    <div className="mb-3">
                                                        <label htmlFor="price" className="form-label form-label">
                                                            Price{' '}
                                                        </label>
                                                        <div className="input-group">
                                                            <span className="input-group-text">USD</span>
                                                            <Input
                                                                step="0.01"
                                                                min="0"
                                                                id="price"
                                                                placeholder="Enter price"
                                                                name="price"
                                                                disabled={false}
                                                                type="number"
                                                                className="form-control"
                                                                value=""
                                                            ></Input>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-lg-4">
                                                    <div className="mb-3">
                                                        <label htmlFor="machineTranslation" className="form-label form-label">
                                                            Machine Translation
                                                        </label>
                                                        <select className="form-select" id="machineTranslation" name="machineTranslation">
                                                            <option value="">Select Option</option>
                                                            <option value="Y">Yes</option>
                                                            <option value="N">No</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="col-lg-12 mb-4">
                                                    <button type="submit" className="btn btn-soft-primary">
                                                        Add Language Pair
                                                    </button>
                                                </div>
                                                <div className="col-lg-12">
                                                    <table className="table-borderless mb-0 table align-middle">
                                                        <thead className="table-light">
                                                            <tr>
                                                                <th>Source Language</th>
                                                                <th>Target Language</th>
                                                                <th>Service</th>
                                                                <th>Price</th>
                                                                <th>Machine Translation</th>
                                                                <th>Actions</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                <td>English</td>
                                                                <td>Hindi</td>
                                                                <td>Translation</td>
                                                                <td>USD 0.1 / word</td>
                                                                <td>No</td>
                                                                <td>
                                                                    <button type="button" className="btn btn-soft-danger btn-sm">
                                                                        Remove
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>Hindi</td>
                                                                <td>English</td>
                                                                <td>Translation</td>
                                                                <td>USD 0.1 / word</td>
                                                                <td>No</td>
                                                                <td>
                                                                    <button type="button" className="btn btn-soft-danger btn-sm">
                                                                        Remove
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>Urdu</td>
                                                                <td>English</td>
                                                                <td>Translation</td>
                                                                <td>USD 0.1 / word</td>
                                                                <td>No</td>
                                                                <td>
                                                                    <button type="button" className="btn btn-soft-danger btn-sm">
                                                                        Remove
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>English</td>
                                                                <td>Urdu</td>
                                                                <td>Translation</td>
                                                                <td>USD 0.1 / word</td>
                                                                <td>No</td>
                                                                <td>
                                                                    <button type="button" className="btn btn-soft-danger btn-sm">
                                                                        Remove
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                    <div className="tab-pane">
                                        <form>
                                            <div className="row">
                                                <div className="col-lg-12">
                                                    <h5 className="mb-4">Qualifications</h5>
                                                </div>
                                                <div className="col-lg-6">
                                                    <div className="mb-3">
                                                        <label htmlFor="type" className="form-label form-label">
                                                            Type of Qualification
                                                        </label>
                                                        <select className="form-select" id="type" name="type">
                                                            <option value="">Select Type</option>
                                                            <option value="High School Diploma">High School Diploma</option>
                                                            <option value="GED (General Educational Development)">
                                                                GED (General Educational Development)
                                                            </option>
                                                            <option value="Certificate">Certificate</option>
                                                            <option value="Diploma">Diploma</option>
                                                            <option value="Associate Degree">Associate Degree</option>
                                                            <option value="Bachelor Degree">Bachelor Degree</option>
                                                            <option value="Masters Degree">Masters Degree</option>
                                                            <option value="Doctorate">Doctorate</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="col-lg-3">
                                                    <div className="mb-3">
                                                        <label htmlFor="from" className="form-label form-label">
                                                            From
                                                        </label>
                                                        <Input id="from" name="from" type="date" className="form-control" value=""></Input>
                                                    </div>
                                                </div>
                                                <div className="col-lg-3">
                                                    <div className="mb-3">
                                                        <label htmlFor="to" className="form-label form-label">
                                                            To
                                                        </label>
                                                        <Input id="to" name="to" type="date" className="form-control" value=""></Input>
                                                    </div>
                                                </div>
                                                <div className="col-lg-6">
                                                    <div className="mb-3">
                                                        <label htmlFor="stream" className="form-label form-label">
                                                            Stream
                                                        </label>
                                                        <Input
                                                            id="stream"
                                                            placeholder="Enter stream/specialization"
                                                            name="stream"
                                                            type="text"
                                                            className="form-control"
                                                            value=""
                                                        ></Input>
                                                    </div>
                                                </div>
                                                <div className="col-lg-6">
                                                    <div className="mb-3">
                                                        <label htmlFor="institution" className="form-label form-label">
                                                            Institution
                                                        </label>
                                                        <Input
                                                            id="institution"
                                                            placeholder="Enter institution name"
                                                            name="institution"
                                                            type="text"
                                                            className="form-control"
                                                            value=""
                                                        ></Input>
                                                    </div>
                                                </div>
                                                <div className="col-lg-6">
                                                    <div className="mb-3">
                                                        <label htmlFor="country" className="form-label form-label">
                                                            Country
                                                        </label>
                                                        <select id="country" name="country" className="form-select">
                                                            <option value="">Select Country</option>
                                                            <option value="AF">Afghanistan (AF)</option>
                                                            <option value="AX">land Islands (AX)</option>
                                                            <option value="AL">Albania (AL)</option>
                                                            <option value="DZ">Algeria (DZ)</option>
                                                            <option value="AS">American Samoa (AS)</option>
                                                            <option value="AD">AndorrA (AD)</option>
                                                            <option value="AO">Angola (AO)</option>
                                                            <option value="AI">Anguilla (AI)</option>
                                                            <option value="AQ">Antarctica (AQ)</option>
                                                            <option value="AG">Antigua and Barbuda (AG)</option>
                                                            <option value="AR">Argentina (AR)</option>
                                                            <option value="AM">Armenia (AM)</option>
                                                            <option value="AW">Aruba (AW)</option>
                                                            <option value="AU">Australia (AU)</option>
                                                            <option value="AT">Austria (AT)</option>
                                                            <option value="AZ">Azerbaijan (AZ)</option>
                                                            <option value="BS">Bahamas (BS)</option>
                                                            <option value="BH">Bahrain (BH)</option>
                                                            <option value="BD">Bangladesh (BD)</option>
                                                            <option value="BB">Barbados (BB)</option>
                                                            <option value="BY">Belarus (BY)</option>
                                                            <option value="BE">Belgium (BE)</option>
                                                            <option value="BZ">Belize (BZ)</option>
                                                            <option value="BJ">Benin (BJ)</option>
                                                            <option value="BM">Bermuda (BM)</option>
                                                            <option value="BT">Bhutan (BT)</option>
                                                            <option value="BO">Bolivia (BO)</option>
                                                            <option value="BA">Bosnia and Herzegovina (BA)</option>
                                                            <option value="BW">Botswana (BW)</option>
                                                            <option value="BV">Bouvet Island (BV)</option>
                                                            <option value="BR">Brazil (BR)</option>
                                                            <option value="IO">British Indian Ocean Territory (IO)</option>
                                                            <option value="BN">Brunei Darussalam (BN)</option>
                                                            <option value="BG">Bulgaria (BG)</option>
                                                            <option value="BF">Burkina Faso (BF)</option>
                                                            <option value="BI">Burundi (BI)</option>
                                                            <option value="KH">Cambodia (KH)</option>
                                                            <option value="CM">Cameroon (CM)</option>
                                                            <option value="CA">Canada (CA)</option>
                                                            <option value="CV">Cape Verde (CV)</option>
                                                            <option value="KY">Cayman Islands (KY)</option>
                                                            <option value="CF">Central African Republic (CF)</option>
                                                            <option value="TD">Chad (TD)</option>
                                                            <option value="CL">Chile (CL)</option>
                                                            <option value="CN">China (CN)</option>
                                                            <option value="CX">Christmas Island (CX)</option>
                                                            <option value="CC">Cocos (Keeling) Islands (CC)</option>
                                                            <option value="CO">Colombia (CO)</option>
                                                            <option value="KM">Comoros (KM)</option>
                                                            <option value="CG">Congo (CG)</option>
                                                            <option value="CD">Congo, The Democratic Republic of the (CD)</option>
                                                            <option value="CK">Cook Islands (CK)</option>
                                                            <option value="CR">Costa Rica (CR)</option>
                                                            <option value="CI">Cote D"Ivoire (CI)</option>
                                                            <option value="HR">Croatia (HR)</option>
                                                            <option value="CU">Cuba (CU)</option>
                                                            <option value="CY">Cyprus (CY)</option>
                                                            <option value="CZ">Czech Republic (CZ)</option>
                                                            <option value="DK">Denmark (DK)</option>
                                                            <option value="DJ">Djibouti (DJ)</option>
                                                            <option value="DM">Dominica (DM)</option>
                                                            <option value="DO">Dominican Republic (DO)</option>
                                                            <option value="EC">Ecuador (EC)</option>
                                                            <option value="EG">Egypt (EG)</option>
                                                            <option value="SV">El Salvador (SV)</option>
                                                            <option value="GQ">Equatorial Guinea (GQ)</option>
                                                            <option value="ER">Eritrea (ER)</option>
                                                            <option value="EE">Estonia (EE)</option>
                                                            <option value="ET">Ethiopia (ET)</option>
                                                            <option value="FK">Falkland Islands (Malvinas) (FK)</option>
                                                            <option value="FO">Faroe Islands (FO)</option>
                                                            <option value="FJ">Fiji (FJ)</option>
                                                            <option value="FI">Finland (FI)</option>
                                                            <option value="FR">France (FR)</option>
                                                            <option value="GF">French Guiana (GF)</option>
                                                            <option value="PF">French Polynesia (PF)</option>
                                                            <option value="TF">French Southern Territories (TF)</option>
                                                            <option value="GA">Gabon (GA)</option>
                                                            <option value="GM">Gambia (GM)</option>
                                                            <option value="GE">Georgia (GE)</option>
                                                            <option value="DE">Germany (DE)</option>
                                                            <option value="GH">Ghana (GH)</option>
                                                            <option value="GI">Gibraltar (GI)</option>
                                                            <option value="GR">Greece (GR)</option>
                                                            <option value="GL">Greenland (GL)</option>
                                                            <option value="GD">Grenada (GD)</option>
                                                            <option value="GP">Guadeloupe (GP)</option>
                                                            <option value="GU">Guam (GU)</option>
                                                            <option value="GT">Guatemala (GT)</option>
                                                            <option value="GG">Guernsey (GG)</option>
                                                            <option value="GN">Guinea (GN)</option>
                                                            <option value="GW">Guinea-Bissau (GW)</option>
                                                            <option value="GY">Guyana (GY)</option>
                                                            <option value="HT">Haiti (HT)</option>
                                                            <option value="HM">Heard Island and Mcdonald Islands (HM)</option>
                                                            <option value="VA">Holy See (Vatican City State) (VA)</option>
                                                            <option value="HN">Honduras (HN)</option>
                                                            <option value="HK">Hong Kong (HK)</option>
                                                            <option value="HU">Hungary (HU)</option>
                                                            <option value="IS">Iceland (IS)</option>
                                                            <option value="IN">India (IN)</option>
                                                            <option value="ID">Indonesia (ID)</option>
                                                            <option value="IR">Iran, Islamic Republic Of (IR)</option>
                                                            <option value="IQ">Iraq (IQ)</option>
                                                            <option value="IE">Ireland (IE)</option>
                                                            <option value="IM">Isle of Man (IM)</option>
                                                            <option value="IL">Israel (IL)</option>
                                                            <option value="IT">Italy (IT)</option>
                                                            <option value="JM">Jamaica (JM)</option>
                                                            <option value="JP">Japan (JP)</option>
                                                            <option value="JE">Jersey (JE)</option>
                                                            <option value="JO">Jordan (JO)</option>
                                                            <option value="KZ">Kazakhstan (KZ)</option>
                                                            <option value="KE">Kenya (KE)</option>
                                                            <option value="KI">Kiribati (KI)</option>
                                                            <option value="KP">Korea, Democratic People"S Republic of (KP)</option>
                                                            <option value="KR">Korea, Republic of (KR)</option>
                                                            <option value="KW">Kuwait (KW)</option>
                                                            <option value="KG">Kyrgyzstan (KG)</option>
                                                            <option value="LA">Lao People"S Democratic Republic (LA)</option>
                                                            <option value="LV">Latvia (LV)</option>
                                                            <option value="LB">Lebanon (LB)</option>
                                                            <option value="LS">Lesotho (LS)</option>
                                                            <option value="LR">Liberia (LR)</option>
                                                            <option value="LY">Libyan Arab Jamahiriya (LY)</option>
                                                            <option value="LI">Liechtenstein (LI)</option>
                                                            <option value="LT">Lithuania (LT)</option>
                                                            <option value="LU">Luxembourg (LU)</option>
                                                            <option value="MO">Macao (MO)</option>
                                                            <option value="MK">Macedonia, The Former Yugoslav Republic of (MK)</option>
                                                            <option value="MG">Madagascar (MG)</option>
                                                            <option value="MW">Malawi (MW)</option>
                                                            <option value="MY">Malaysia (MY)</option>
                                                            <option value="MV">Maldives (MV)</option>
                                                            <option value="ML">Mali (ML)</option>
                                                            <option value="MT">Malta (MT)</option>
                                                            <option value="MH">Marshall Islands (MH)</option>
                                                            <option value="MQ">Martinique (MQ)</option>
                                                            <option value="MR">Mauritania (MR)</option>
                                                            <option value="MU">Mauritius (MU)</option>
                                                            <option value="YT">Mayotte (YT)</option>
                                                            <option value="MX">Mexico (MX)</option>
                                                            <option value="FM">Micronesia, Federated States of (FM)</option>
                                                            <option value="MD">Moldova, Republic of (MD)</option>
                                                            <option value="MC">Monaco (MC)</option>
                                                            <option value="MN">Mongolia (MN)</option>
                                                            <option value="ME">Montenegro (ME)</option>
                                                            <option value="MS">Montserrat (MS)</option>
                                                            <option value="MA">Morocco (MA)</option>
                                                            <option value="MZ">Mozambique (MZ)</option>
                                                            <option value="MM">Myanmar (MM)</option>
                                                            <option value="NA">Namibia (NA)</option>
                                                            <option value="NR">Nauru (NR)</option>
                                                            <option value="NP">Nepal (NP)</option>
                                                            <option value="NL">Netherlands (NL)</option>
                                                            <option value="AN">Netherlands Antilles (AN)</option>
                                                            <option value="NC">New Caledonia (NC)</option>
                                                            <option value="NZ">New Zealand (NZ)</option>
                                                            <option value="NI">Nicaragua (NI)</option>
                                                            <option value="NE">Niger (NE)</option>
                                                            <option value="NG">Nigeria (NG)</option>
                                                            <option value="NU">Niue (NU)</option>
                                                            <option value="NF">Norfolk Island (NF)</option>
                                                            <option value="MP">Northern Mariana Islands (MP)</option>
                                                            <option value="NO">Norway (NO)</option>
                                                            <option value="OM">Oman (OM)</option>
                                                            <option value="PK">Pakistan (PK)</option>
                                                            <option value="PW">Palau (PW)</option>
                                                            <option value="PS">Palestinian Territory, Occupied (PS)</option>
                                                            <option value="PA">Panama (PA)</option>
                                                            <option value="PG">Papua New Guinea (PG)</option>
                                                            <option value="PY">Paraguay (PY)</option>
                                                            <option value="PE">Peru (PE)</option>
                                                            <option value="PH">Philippines (PH)</option>
                                                            <option value="PN">Pitcairn (PN)</option>
                                                            <option value="PL">Poland (PL)</option>
                                                            <option value="PT">Portugal (PT)</option>
                                                            <option value="PR">Puerto Rico (PR)</option>
                                                            <option value="QA">Qatar (QA)</option>
                                                            <option value="RE">Reunion (RE)</option>
                                                            <option value="RO">Romania (RO)</option>
                                                            <option value="RU">Russian Federation (RU)</option>
                                                            <option value="RW">RWANDA (RW)</option>
                                                            <option value="SH">Saint Helena (SH)</option>
                                                            <option value="KN">Saint Kitts and Nevis (KN)</option>
                                                            <option value="LC">Saint Lucia (LC)</option>
                                                            <option value="PM">Saint Pierre and Miquelon (PM)</option>
                                                            <option value="VC">Saint Vincent and the Grenadines (VC)</option>
                                                            <option value="WS">Samoa (WS)</option>
                                                            <option value="SM">San Marino (SM)</option>
                                                            <option value="ST">Sao Tome and Principe (ST)</option>
                                                            <option value="SA">Saudi Arabia (SA)</option>
                                                            <option value="SN">Senegal (SN)</option>
                                                            <option value="RS">Serbia (RS)</option>
                                                            <option value="SC">Seychelles (SC)</option>
                                                            <option value="SL">Sierra Leone (SL)</option>
                                                            <option value="SG">Singapore (SG)</option>
                                                            <option value="SK">Slovakia (SK)</option>
                                                            <option value="SI">Slovenia (SI)</option>
                                                            <option value="SB">Solomon Islands (SB)</option>
                                                            <option value="SO">Somalia (SO)</option>
                                                            <option value="ZA">South Africa (ZA)</option>
                                                            <option value="GS">South Georgia and the South Sandwich Islands (GS)</option>
                                                            <option value="ES">Spain (ES)</option>
                                                            <option value="LK">Sri Lanka (LK)</option>
                                                            <option value="SD">Sudan (SD)</option>
                                                            <option value="SR">Suriname (SR)</option>
                                                            <option value="SJ">Svalbard and Jan Mayen (SJ)</option>
                                                            <option value="SZ">Swaziland (SZ)</option>
                                                            <option value="SE">Sweden (SE)</option>
                                                            <option value="CH">Switzerland (CH)</option>
                                                            <option value="SY">Syrian Arab Republic (SY)</option>
                                                            <option value="TW">Taiwan, Province of China (TW)</option>
                                                            <option value="TJ">Tajikistan (TJ)</option>
                                                            <option value="TZ">Tanzania, United Republic of (TZ)</option>
                                                            <option value="TH">Thailand (TH)</option>
                                                            <option value="TL">Timor-Leste (TL)</option>
                                                            <option value="TG">Togo (TG)</option>
                                                            <option value="TK">Tokelau (TK)</option>
                                                            <option value="TO">Tonga (TO)</option>
                                                            <option value="TT">Trinidad and Tobago (TT)</option>
                                                            <option value="TN">Tunisia (TN)</option>
                                                            <option value="TR">Turkey (TR)</option>
                                                            <option value="TM">Turkmenistan (TM)</option>
                                                            <option value="TC">Turks and Caicos Islands (TC)</option>
                                                            <option value="TV">Tuvalu (TV)</option>
                                                            <option value="UG">Uganda (UG)</option>
                                                            <option value="UA">Ukraine (UA)</option>
                                                            <option value="AE">United Arab Emirates (AE)</option>
                                                            <option value="GB">United Kingdom (GB)</option>
                                                            <option value="US">United States (US)</option>
                                                            <option value="UM">United States Minor Outlying Islands (UM)</option>
                                                            <option value="UY">Uruguay (UY)</option>
                                                            <option value="UZ">Uzbekistan (UZ)</option>
                                                            <option value="VU">Vanuatu (VU)</option>
                                                            <option value="VE">Venezuela (VE)</option>
                                                            <option value="VN">Viet Nam (VN)</option>
                                                            <option value="VG">Virgin Islands, British (VG)</option>
                                                            <option value="VI">Virgin Islands, U.S. (VI)</option>
                                                            <option value="WF">Wallis and Futuna (WF)</option>
                                                            <option value="EH">Western Sahara (EH)</option>
                                                            <option value="YE">Yemen (YE)</option>
                                                            <option value="ZM">Zambia (ZM)</option>
                                                            <option value="ZW">Zimbabwe (ZW)</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="col-lg-6">
                                                    <div className="mb-3">
                                                        <label htmlFor="city" className="form-label form-label">
                                                            City
                                                        </label>
                                                        <Input
                                                            id="city"
                                                            placeholder="Enter city"
                                                            name="city"
                                                            type="text"
                                                            className="form-control"
                                                            value=""
                                                        ></Input>
                                                    </div>
                                                </div>
                                                <div className="col-lg-12 mb-4">
                                                    <button type="button" className="btn btn-soft-primary">
                                                        Add Qualification
                                                    </button>
                                                </div>
                                                <div className="col-lg-12">
                                                    <table className="table-borderless mb-0 table align-middle">
                                                        <thead className="table-light">
                                                            <tr>
                                                                <th>Type</th>
                                                                <th>Period</th>
                                                                <th>Stream</th>
                                                                <th>Institution</th>
                                                                <th>Location</th>
                                                                <th>Actions</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                <td>Bachelor Degree</td>
                                                                <td>14 Aug 1978 - 14 Aug 1981</td>
                                                                <td>Arts,</td>
                                                                <td>University of Mumbai</td>
                                                                <td>Mumbai, India (IN)</td>
                                                                <td>
                                                                    <button type="button" className="btn btn-soft-danger btn-sm">
                                                                        Remove
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                    <div className="tab-pane">
                                        <form>
                                            <div className="row">
                                                <div className="col-lg-12">
                                                    <h5 className="mb-4">References</h5>
                                                </div>
                                                <div className="col-lg-12">
                                                    <div className="mb-3">
                                                        <label htmlFor="companyName" className="form-label form-label">
                                                            Company Name
                                                        </label>
                                                        <Input
                                                            id="companyName"
                                                            placeholder="Enter company name"
                                                            name="companyName"
                                                            type="text"
                                                            className="form-control"
                                                            value=""
                                                        ></Input>
                                                    </div>
                                                </div>
                                                <div className="col-lg-6">
                                                    <div className="mb-3">
                                                        <label htmlFor="refereeName" className="form-label form-label">
                                                            Referee Name
                                                        </label>
                                                        <Input
                                                            id="refereeName"
                                                            placeholder="Enter referee name"
                                                            name="refereeName"
                                                            type="text"
                                                            className="form-control"
                                                            value=""
                                                        ></Input>
                                                    </div>
                                                </div>
                                                <div className="col-lg-6">
                                                    <div className="mb-3">
                                                        <label htmlFor="refereeContactEmail" className="form-label form-label">
                                                            Referee Contact Email
                                                        </label>
                                                        <Input
                                                            id="refereeContactEmail"
                                                            placeholder="Enter referee email"
                                                            name="refereeContactEmail"
                                                            type="email"
                                                            className="form-control"
                                                            value=""
                                                        ></Input>
                                                    </div>
                                                </div>
                                                <div className="col-lg-12 mb-4">
                                                    <button type="button" className="btn btn-soft-primary">
                                                        Add Reference
                                                    </button>
                                                </div>
                                                <div className="col-lg-12">
                                                    <table className="table-borderless mb-0 table align-middle">
                                                        <thead className="table-light">
                                                            <tr>
                                                                <th>Company Name</th>
                                                                <th>Referee Name</th>
                                                                <th>Referee Email</th>
                                                                <th>Actions</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                <td></td>
                                                                <td>-</td>
                                                                <td>no@gmail.com</td>
                                                                <td>
                                                                    <button type="button" className="btn btn-soft-danger btn-sm">
                                                                        Remove
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                    <div className="tab-pane">
                                        <form>
                                            <div className="row">
                                                <div className="col-lg-12">
                                                    <h5 className="mb-4">Signature</h5>
                                                </div>
                                                <div className="col-lg-12 mb-3">
                                                    <img
                                                        src="https://tvprivatefiles.blob.core.windows.net/user-files/3f29fa67-2214-4cbb-a2f9-93da4a3a82a6/signatures/1745265053558-3f29fa67-2214-4cbb-a2f9-93da4a3a82a6?sv=2025-01-05&amp;se=2025-04-28T18%3A13%3A42Z&amp;sr=b&amp;sp=rw&amp;sig=ELcvUGA%2Fi3YfEzx8p5prqm1wFpedB8%2FsobM4ijYoigM%3D"
                                                        alt="Signature"
                                                        className="img-fluid"
                                                        width={300}
                                                    ></img>
                                                    <div className="d-flex mt-2 gap-2">
                                                        <button type="button" className="btn btn-primary btn-sm">
                                                            Download Signature
                                                        </button>
                                                        <button type="button" className="btn btn-danger btn-sm">
                                                            Remove Signature
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="col-lg-12">
                                                    <div className="mb-3">
                                                        <label htmlFor="signature" className="form-label form-label">
                                                            Upload Signature
                                                        </label>
                                                        <Input id="signature" accept="image/*" type="file" className="form-control"></Input>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                        <form>
                                            <div className="row">
                                                <div className="col-lg-12">
                                                    <h5 className="mb-4">Documents</h5>
                                                </div>
                                                <div className="col-lg-6">
                                                    <div className="mb-3">
                                                        <label htmlFor="documentType" className="form-label form-label">
                                                            Document Type
                                                        </label>
                                                        <Input
                                                            id="documentType"
                                                            placeholder="Enter document type"
                                                            name="documentType"
                                                            type="text"
                                                            className="form-control"
                                                            value=""
                                                        ></Input>
                                                    </div>
                                                </div>
                                                <div className="col-lg-6">
                                                    <div className="mb-3">
                                                        <label htmlFor="file" className="form-label form-label">
                                                            File
                                                        </label>
                                                        <Input id="file" type="file" className="form-control"></Input>
                                                    </div>
                                                </div>
                                                <div className="col-lg-12 mb-4">
                                                    <button type="button" className="btn btn-soft-primary">
                                                        Add Document
                                                    </button>
                                                </div>
                                                <div className="col-lg-12">
                                                    <table className="table-borderless mb-0 table align-middle">
                                                        <thead className="table-light">
                                                            <tr>
                                                                <th scope="col">File Name</th>
                                                                <th scope="col">Type</th>
                                                                <th scope="col">Action</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                <td>
                                                                    <div className="d-flex align-items-center">
                                                                        <div className="avatar-sm">
                                                                            <div className="avatar-title bg-light text-primary fs-20 rounded">
                                                                                <i className="ri-file-pdf-fill"></i>
                                                                            </div>
                                                                        </div>
                                                                        <div className="ms-3 flex-grow-1">
                                                                            <h6 className="fs-15 mb-0">
                                                                                <a
                                                                                    className="link-secondary"
                                                                                    href="/profile/edit"
                                                                                    data-discover="true"
                                                                                >
                                                                                    Ahmed Manzoor.pdf
                                                                                </a>
                                                                            </h6>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td>CV</td>
                                                                <td>
                                                                    <div className="dropdown dropstart">
                                                                        <a
                                                                            id="dropdownMenuLink15"
                                                                            role="button"
                                                                            aria-haspopup="true"
                                                                            className="btn btn-light btn-icon"
                                                                            aria-expanded="false"
                                                                        >
                                                                            <i className="ri-equalizer-fill"></i>
                                                                        </a>
                                                                        <div
                                                                            tabIndex={-1}
                                                                            role="menu"
                                                                            aria-hidden="true"
                                                                            className="dropdown-menu"
                                                                            data-bs-popper="static"
                                                                        >
                                                                            <button
                                                                                type="button"
                                                                                tabIndex={0}
                                                                                role="menuitem"
                                                                                className="dropdown-item"
                                                                            >
                                                                                <i className="ri-download-2-fill text-muted me-2 align-middle"></i>
                                                                                Download
                                                                            </button>
                                                                            <div tabIndex={-1} className="dropdown-divider"></div>
                                                                            <button
                                                                                type="button"
                                                                                tabIndex={0}
                                                                                role="menuitem"
                                                                                className="dropdown-item"
                                                                            >
                                                                                <i className="ri-delete-bin-5-line text-muted me-2 align-middle"></i>
                                                                                Delete
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> */}
                </div>
            </div>

            {/* <div className="flex min-h-screen items-start justify-center bg-gray-100 p-6">
                <div className="w-full max-w-6xl rounded-xl p-6">
                    <div className="flex flex-col gap-6 lg:flex-row"> */}
            {/* Profile Card */}
            {/* <Card className="w-full lg:max-w-xs">
                            <CardContent className="flex flex-col items-center p-6 text-center"> */}
            {/* Avatar + Name + Email + ID */}
            {/* </CardContent>
                        </Card> */}

            {/* Tabs + Form Card */}
            {/* <Card className="w-full flex-1">
                            <CardContent className="p-6"> */}
            {/* Tabs and Account Information Form */}
            {/* </CardContent>
                        </Card>
                    </div>
                </div>
            </div> */}

            {/* <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                </div>
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative flex min-h-[100vh] flex-auto gap-3 rounded-xl border md:min-h-min">
                    <div className="bg-sidebar-primary/10 dark:bg-sidebar-primary/20">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                    <div className="bg-sidebar-primary/10 dark:bg-sidebar-primary/20">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                </div>
            </div> */}
        </AppLayout>
    );
}

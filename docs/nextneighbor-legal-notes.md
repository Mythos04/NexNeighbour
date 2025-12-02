# NextNeighbor Legal Notes

## DSGVO / GDPR Compliance

### Required Legal Pages

1. **Impressum (Imprint)**
   - Location: `/impressum` or linked from footer
   - Must include:
     - Company name and legal form
     - Address
     - Contact information (email, phone)
     - VAT ID (if applicable)
     - Responsible person(s)
     - Register entries (if applicable)

2. **Datenschutzerklärung (Privacy Policy)**
   - Location: `/datenschutz` or linked from footer
   - Must include:
     - Data controller information
     - Types of data collected
     - Purpose of data processing
     - Legal basis for processing
     - Data retention periods
     - User rights (access, deletion, portability)
     - Third-party services used

### Third-Party Services

Currently used services that require disclosure:

1. **OpenStreetMap Tiles (via CartoDB)**
   - Attribution displayed in map footer
   - Privacy: Only IP addresses transmitted for tile loading
   - Documentation: https://carto.com/privacy/

### Data Collection

This application currently:
- ✅ Uses localStorage for language preference (local only)
- ❌ Does NOT use cookies for tracking
- ❌ Does NOT use analytics services
- ❌ Does NOT collect personal data (in current mock state)

### Future Considerations

When adding user accounts or data submission:
- [ ] Implement consent management
- [ ] Add cookie banner if using tracking cookies
- [ ] Update privacy policy with specific data handling
- [ ] Implement data export functionality
- [ ] Implement data deletion functionality
- [ ] Add Terms of Service

## Accessibility (WCAG 2.1)

Implemented features:
- ✅ Skip link for keyboard navigation
- ✅ ARIA labels on interactive elements
- ✅ Focus traps in modals
- ✅ Sufficient color contrast (tested with WCAG guidelines)
- ✅ Keyboard navigation support

## OpenStreetMap Attribution

Required attribution text is displayed in map view:
"Map data © OpenStreetMap contributors"

This is required by OpenStreetMap's license terms.

## Contact

For legal inquiries, please contact:
[TODO: Add contact information]

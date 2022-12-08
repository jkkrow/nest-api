import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  Matches,
} from 'class-validator';

type CompareType =
  | 'equal'
  | 'less'
  | 'less or equal'
  | 'greater'
  | 'greater or equal';

export function IsEqualTo(property: string, options?: ValidationOptions) {
  return CompareTo(property, 'equal', options);
}

export function IsGreaterThan(property: string, options?: ValidationOptions) {
  return CompareTo(property, 'greater', options);
}

export function IsLessThan(property: string, options?: ValidationOptions) {
  return CompareTo(property, 'less', options);
}

export function IsGreaterThanOrEqualTo(
  property: string,
  options?: ValidationOptions,
) {
  return CompareTo(property, 'greater or equal', options);
}

export function IsLessThanOrEqualTo(
  property: string,
  options?: ValidationOptions,
) {
  return CompareTo(property, 'less or equal', options);
}

export function CompareTo(
  property: string,
  type: CompareType,
  options?: ValidationOptions,
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'isEqualTo',
      target: object.constructor,
      propertyName,
      constraints: [property],
      options,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];

          switch (type) {
            case 'equal':
              return value === relatedValue;
            case 'greater':
              return value > relatedValue;
            case 'greater or equal':
              return value >= relatedValue;
            case 'less':
              return value < relatedValue;
            case 'less or equal':
              return value <= relatedValue;
            default:
              return false;
          }
        },

        defaultMessage(args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          let message: string;

          switch (type) {
            case 'equal':
              message = 'equal to';
            case 'greater':
              message = 'greater than';
            case 'greater or equal':
              message = 'greater than or equal to';
            case 'less':
              message = 'less than';
            case 'less or equal':
              message = 'less than or equal to';
          }

          return `${propertyName} must be ${message} ${relatedPropertyName}`;
        },
      },
    });
  };
}

export function IsStrongPassword() {
  return Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
    {
      message: 'password too weak',
    },
  );
}

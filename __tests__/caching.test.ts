import { initMemofy, memoize } from "../lib";

describe("Caching Tests", () => {
  initMemofy();
  const concatPhoneNumber = jest.fn(
    (_extension: number, _number: number): string => {
      return `${_extension}+${_number}`;
    }
  );
  const _concatPhoneNumber = memoize(concatPhoneNumber);
  beforeEach(() => {
    _concatPhoneNumber(90, 5555552);
  });
  test("should return value from caching", () => {
    expect(_concatPhoneNumber(90, 5555552)).toEqual("90+5555552");
    expect(concatPhoneNumber).toHaveBeenCalledTimes(1);

    expect(_concatPhoneNumber(90, 5555552)).toEqual("90+5555552");
    expect(concatPhoneNumber).toHaveBeenCalledTimes(1); // Because value returned from cache
    expect(_concatPhoneNumber(90, 5555553)).toEqual("90+5555553");
    expect(concatPhoneNumber).toHaveBeenCalledTimes(2);
    expect(_concatPhoneNumber(90, 5555552)).toEqual("90+5555552");
    expect(concatPhoneNumber).toHaveBeenCalledTimes(2);
  });

  test("should return value from caching and it has been called once", () => {
    expect(_concatPhoneNumber(90, 5555553)).toEqual("90+5555553");
    expect(concatPhoneNumber).toHaveBeenCalledTimes(2); // Because value returned from cache
  });

  test("should return value from caching", () => {
    const getPrice = jest.fn(
      (product: { price: number }): number => product.price
    );
    const _getPrice = memoize(getPrice, []);
    expect(_getPrice({ price: 10 })).toBe(10);
    const product = { price: 22 };
    expect(_getPrice(product)).toBe(22);
    expect(_getPrice(product)).toBe(22);
    expect(getPrice).toHaveBeenCalledTimes(2);
    product.price = 5;
    expect(_getPrice(product)).toBe(5);
    expect(getPrice).toHaveBeenCalledTimes(3);
    expect(_getPrice(product)).toBe(5);
    expect(_getPrice(product)).toBe(5);
    expect(_getPrice(product)).toBe(5);
    expect(getPrice).toHaveBeenCalledTimes(3);
  });

  test("should return value from caching when execute heavy function", () => {
    enum PhoneType {
      MOBILE_PHONE = "MOBILE_PHONE",
      FAX = "FAX",
    }

    interface Phone {
      phoneType: PhoneType;
      areaCode: string;
      phoneNumber: string;
      countryCode: string;
      extensionNumber?: string;
    }

    const getPhoneNumber = jest.fn(
      (phone: Phone, countryCode: boolean): string => {
        let check = 0;
        if (phone.areaCode.startsWith("5")) {
          check = -1;
        } else {
          check = (phone.phoneNumber.substring(0, 3) || "").indexOf("444");
        }

        if (check === -1) {
          const phoneCountryCode = countryCode
            ? phone.countryCode.slice(1)
            : phone.countryCode;
          return (
            phoneCountryCode +
            phone.areaCode +
            phone.phoneNumber +
            (phone.extensionNumber && phone.phoneType === PhoneType.MOBILE_PHONE
              ? `,${phone.extensionNumber}#`
              : "")
          );
        }

        return phone.phoneNumber;
      }
    );
    const getPriorityPhone = jest.fn(
      (phones: Phone[], isCountryCode: boolean): string => {
        if (phones && phones.length > 0) {
          const phoneTypes = [PhoneType.MOBILE_PHONE, PhoneType.FAX];

          const phoneMap = phoneTypes.reduce((prev, curr) => {
            return {
              ...prev,
              [curr]: phones.find((p) => p.phoneType === curr) || null,
            };
          }, {} as Record<PhoneType, Phone | null>);

          const phoneNumber =
            phoneMap[PhoneType.MOBILE_PHONE] || phoneMap[PhoneType.FAX];

          return phoneNumber ? _getPhoneNumber(phoneNumber, isCountryCode) : "";
        }

        return "";
      }
    );
    const _getPriorityPhone = memoize<string>(getPriorityPhone);

    const _getPhoneNumber = memoize<string>(getPhoneNumber);

    const myPhones = [
      {
        countryCode: "+90",
        areaCode: "532",
        phoneNumber: "1111111",
        extensionNumber: "Fax",
        phoneType: PhoneType.MOBILE_PHONE,
      },
      {
        countryCode: "+90",
        areaCode: "532",
        phoneNumber: "1111111",
        extensionNumber: "",
        phoneType: PhoneType.FAX,
      },
    ];

    expect(_getPriorityPhone(myPhones, true)).toBe("905321111111,Fax#");
    expect(_getPriorityPhone(myPhones, false)).toBe("+905321111111,Fax#");
    expect(getPriorityPhone).toHaveBeenCalledTimes(2);
    expect(_getPriorityPhone(myPhones, true)).toBe("905321111111,Fax#");
    expect(getPriorityPhone).toHaveBeenCalledTimes(2);
    expect(getPhoneNumber).toHaveBeenCalledTimes(2);
    while (myPhones.length > 0) {
      myPhones.pop();
    }
    expect(_getPriorityPhone(myPhones, false)).toBe("");
    expect(getPriorityPhone).toHaveBeenCalledTimes(3);
  });
  test("should return cached value when passed object of function", () => {
    const arg = {
      name: "Ahmet",
      getName: jest.fn(function (name: string) {
        return name;
      }),
    };
    const _getName = memoize(arg.getName);
    expect(_getName("Jack")).toBe("Jack");
    expect(_getName("Jack")).toBe("Jack");
    expect(arg.getName).toHaveBeenCalledTimes(1);
    expect(_getName("John")).toBe("John");
    expect(arg.getName).toHaveBeenCalledTimes(2);
  });
  test("should return correct result when passing Function prop in deps", () => {
    const getNumber = jest.fn((x: number) => x * 10);
    let depFunc = () => {
      return 10;
    };
    const _getNumber = memoize(getNumber, [depFunc]);
    expect(_getNumber(2)).toBe(2 * 10);
    depFunc = () => {
      return 5;
    };
    expect(_getNumber(3)).toBe(30);
    expect(_getNumber(3)).toBe(30);
    expect(getNumber).toHaveBeenCalledTimes(2);
  });
  test("should return cached result when passed function used context", () => {
    const context = { name: "John" };

    const getName = jest.fn(function (suffix: string) {
      return `${suffix} ${this.name}`;
    });
    const memoizedGetName = memoize(getName, [context], context);
    expect(memoizedGetName("Mr")).toBe("Mr John");
    expect(memoizedGetName("Mr")).toBe("Mr John");
    expect(memoizedGetName("Mr")).toBe("Mr John");
    expect(memoizedGetName("Ms")).toBe("Ms John");
    expect(getName).toHaveBeenCalledTimes(2);

    context.name = "Lily";
    expect(memoizedGetName("Ms")).toBe("Ms Lily");
    expect(getName).toHaveBeenCalledTimes(3);
  });

  test("should return cached result when passed function used context", () => {
    const getName = jest.fn((suffix: string) => {
      return `${suffix} ${global.user.name}`;
    });
    const memoizedGetName = memoize(getName, [], global);
    expect(memoizedGetName("Mr")).toBe("Mr Jack");
    expect(memoizedGetName("Mr")).toBe("Mr Jack");
    expect(getName).toHaveBeenCalledTimes(1);
    expect(memoizedGetName("Ms")).toBe("Ms Jack");
  });
});

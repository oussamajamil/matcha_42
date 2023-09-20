
import * as bcrypt from 'bcryptjs';

export async function hashPassword(password:string) {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }

 
  function reviver(key:any, value:any) {
    const dateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;
    if (typeof value === 'string' && dateFormat.test(value)) {
      return new Date(value);
    }
  
    return value;
  }
  
  export function safeParse(json:any) {
    try {
      if (typeof json === 'string') {
        return JSON.parse(json, reviver);
      }
      return json;
    } catch (e) {
      return undefined;
    }
  }
  

  export function EasyParms() {
    return function (target: any, key: string, descriptor: PropertyDescriptor) {
      const orignalMethod = descriptor.value;
      descriptor.value = async function (params: any, ...args: any[]) {
        try{
          const {
            skip,
            take,
            where,
          } = params;
          if (skip && !skip.match(/^\d+$/))
            {
              console.log("i am here skip");
              throw  new  Error('skip must be a number');
            }
          if (take && !take.match(/^\d+$/))
          {
            console.log("i am here must be a number");
            
            throw new  Error('take must be a number');
          }
          params.skip = safeParse(skip || '0');
          params.take = safeParse(take || '10');
          try {
            params.where = safeParse(where || '{}');
            params.where = Object.keys(params.where).map((key) => {
              if (key === 'AND' && Array.isArray(params.where[key])) {
                return params.where[key].map((item:any) => {
                  return Object.keys(item).map((key2) => {
                    if (typeof item[key2] === 'object') {
                      return `${key2} = '${JSON.stringify(item[key2])}'`;
                    }
                    if (typeof item[key2] === 'string') {
                      return `${key2} = '${item[key2]}'`;
                    }
                    return `${key2} = ${item[key2]}`;
                  }
                  ).join(' AND ');
                }
                ).join(' AND ');
              }
              if (key === 'OR' && Array.isArray(params.where[key])) {
                const or = params.where[key].map((item:any) => {
                  return Object.keys(item).map((key2) => {
                    if (typeof item[key2] === 'object') {
                      return `${key2} = '${JSON.stringify(item[key2])}'`;
                    }
                    if (typeof item[key2] === 'string') {
                      return `${key2} = '${item[key2]}'`;
                    }
                    return `${key2} = ${item[key2]}`;
                  }
                  ).join(' AND ');
                }
                ).join(' OR ');
                return `(${or})`;
              }
              if (key === 'NOT' && Array.isArray(params.where[key])) {
                const not = params.where[key].map((item:any) => {
                  return Object.keys(item).map((key2) => {
                    if (typeof item[key2] === 'object') {
                      return `${key2} = '${JSON.stringify(item[key2])}'`;
                    }
                    if (typeof item[key2] === 'string') {
                      return `${key2} = '${item[key2]}'`;
                    }
                    return `${key2} = ${item[key2]}`;
                  }
                  ).join(' AND ');
                }
                ).join(' AND ');
                return `NOT (${not})`;
              }

              if (typeof params.where[key] === 'object') {
              return Object.keys(params.where[key]).map((key2) => {
                if (key2 === 'content') {
                  return `${key} LIKE '%${params.where[key][key2]}%'`;
                }
                if (key2 === 'gt') {
                  return `${key} > ${params.where[key][key2]}`;
                }
                if (key2 === 'gte') {
                  return `${key} >= ${params.where[key][key2]}`;
                }
                if (key2 === 'lt') {
                  return `${key} < ${params.where[key][key2]}`;
                }
                if (key2 === 'lte') {
                  return `${key} <= ${params.where[key][key2]}`;
                }
                if (key2 === 'ne') {
                  return `${key} != ${params.where[key][key2]}`;
                }
                if (key2 === 'in') {
                  return `${key} IN (${params.where[key][key2].map((item:any) => {
                    if (typeof item === 'string') {
                      return `'${item}'`;
                    }
                    return item;
                  }
                  ).join(',')} )`;

                }
                if (key2 === 'nin') {
                  return `${key} NOT IN (${params.where[key][key2].map((item:any) => {
                    if (typeof item === 'string') {
                      return `'${item}'`;
                    }
                    return item;
                  }
                  ).join(',')})`;
                
                }
                return `${key} = '${JSON.stringify(params.where[key])}'`;
              
              }
               ).join(' AND ');
              }
              if (typeof params.where[key] === 'string') {
                return `${key} = '${params.where[key]}'`;
              }
              return `${key} = ${params.where[key]}`;
            }
            ).join(' AND ');
          } catch (e) {
            console.log("i am here json");
            
            return new Error('where must be a json');
          }
          const result = await orignalMethod.call(this, params, ...args);
          return result; 
        }
        catch(error : any){
          console.log("i am here error");
         return {
            error: error.message,
            statusCode: 400
         }
        }
        };
        return descriptor;
      }
  }
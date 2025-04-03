export class GlobalConstants {
  // Mensajes generales
  public static genericError: string = "Algo salió mal. Por favor, inténtelo de nuevo más tarde.";
  public static unauthorized: string = "No tiene autorización para acceder a esta página.";
  public static productExistsError: string = "El producto ya existe.";
  public static productAdded: string = "Producto agregado exitosamente.";

  // Expresiones regulares (validaciones)
  public static nameRegex: string = "[a-zA-Z0-9 ]*";
  public static emailRegex: string = "[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}";
  public static contactNumberRegex: string = "^[e0-9]{10,10}$";

  // Variables
  public static error: string = "error";

  // Mensajes de autenticación y permisos
  public static sessionExpired: string = "Su sesión ha expirado. Por favor, inicie sesión nuevamente.";
  public static accessDenied: string = "No tiene los permisos necesarios para acceder a esta página.";
}
